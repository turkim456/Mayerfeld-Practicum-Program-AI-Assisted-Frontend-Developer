import express from 'express';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { fromNodeHeaders } from 'better-auth/node';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function signPaymentEvent(body, secret, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = createHmac('sha256', secret).update(timestamp + '.').update(body).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

export function verifyPaymentEvent(body, header, secret) {
  const parts = /^t=(\d+),v1=([a-f0-9]{64})$/.exec(header || '');
  if (!parts || Math.abs(Date.now() / 1000 - Number(parts[1])) > 300) return false;
  const expected = signPaymentEvent(body, secret, Number(parts[1])).split('v1=')[1];
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(parts[2], 'hex'));
}

// This is a local payment simulator, not an external payment processor.
// Dependencies are injected so tests can use the real database and HTTP webhook.
export function paymentRouter({ db, auth, origin, secret, deliverWebhook = fetch }) {
  if (!secret || secret.length < 32) throw new Error('A server secret is required for simulated payment events.');
  const router = express.Router();

  router.get('/payment-config', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ provider: 'simulation', simulation: true, currency: 'SAR', ready: true });
  });

  // The only route that can write status='paid'. Verify raw bytes before parsing.
  router.post('/payments/webhook', express.raw({ type: 'application/json', limit: '16kb' }), async (req, res) => {
    if (!Buffer.isBuffer(req.body) || !verifyPaymentEvent(req.body, req.headers['x-payment-signature'], secret)) {
      return res.status(400).json({ error: 'Invalid or expired payment event signature.' });
    }
    let event;
    try { event = JSON.parse(req.body.toString('utf8')); }
    catch { return res.status(400).json({ error: 'Invalid payment event.' }); }
    if (!event || typeof event !== 'object') return res.status(400).json({ error: 'Invalid payment event.' });
    const data = event.data;
    if (event.type !== 'simulation.payment.completed' || event.simulation !== true || !uuid.test(event.id || '') ||
      !data || !uuid.test(data.orderId || '') || !uuid.test(data.sessionId || '') || typeof data.userId !== 'string' ||
      !Number.isSafeInteger(data.amount) || data.amount < 50 || data.currency !== 'sar') {
      return res.status(400).json({ error: 'Invalid simulated payment event.' });
    }
    try {
      const result = await db.query(`UPDATE orders SET status = 'paid',
        paid_at = COALESCE(paid_at, NOW()), payment_event_id = COALESCE(payment_event_id, $7)
        WHERE id = $1 AND checkout_session_id = $2 AND user_id = $3
        AND total_cents = $4 AND currency = $5 AND payment_provider = $6
        RETURNING id`, [data.orderId, data.sessionId, data.userId, data.amount, data.currency, 'simulation', event.id]);
      if (!result.rowCount) return res.status(409).json({ error: 'Event does not match a simulated order.' });
      return res.json({ received: true, simulation: true });
    } catch {
      return res.status(503).json({ error: 'Unable to save confirmation. Retry this event.' });
    }
  });

  async function requireUser(req, res, next) {
    try {
      const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
      if (!session?.user) return res.status(401).json({ error: 'Please sign in before ordering.' });
      req.user = session.user;
      next();
    } catch { res.status(503).json({ error: 'Unable to check your sign-in. Please try again.' }); }
  }

  function requireOrigin(req, res, next) {
    if (req.headers.origin !== origin) return res.status(403).json({ error: 'Invalid request origin.' });
    next();
  }

  router.post('/checkout', requireUser, requireOrigin, express.json({ limit: '16kb' }), async (req, res) => {
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length < 1 || items.length > 50 || items.some(item =>
      !Number.isSafeInteger(item?.dishId) || item.dishId < 1 || !Number.isSafeInteger(item?.quantity) || item.quantity < 1 || item.quantity > 99) ||
      new Set(items.map(item => item.dishId)).size !== items.length) {
      return res.status(400).json({ error: 'Choose 1–99 of each dish, with no duplicate dishes.' });
    }
    const orderId = randomUUID();
    const sessionId = randomUUID();
    let client;
    try {
      client = await db.connect();
      await client.query('BEGIN');
      const result = await client.query('SELECT id, name, (price * 100)::integer AS unit_price_cents FROM dishes WHERE id = ANY($1::integer[])', [items.map(item => item.dishId)]);
      if (result.rows.length !== items.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'One of these dishes is no longer available.' });
      }
      const snapshot = items.map(item => ({ ...result.rows.find(dish => dish.id === item.dishId), quantity: item.quantity }));
      const total = snapshot.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0);
      if (!Number.isSafeInteger(total) || total < 50 || total > 99999999) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Order total is outside the supported range.' });
      }
      await client.query(`INSERT INTO orders (id, user_id, total_cents, currency, payment_provider, checkout_session_id)
        VALUES ($1, $2, $3, 'sar', 'simulation', $4)`, [orderId, req.user.id, total, sessionId]);
      for (const item of snapshot) {
        await client.query('INSERT INTO "orderItems" (order_id, dish_id, dish_name, unit_price_cents, quantity) VALUES ($1, $2, $3, $4, $5)',
          [orderId, item.id, item.name, item.unit_price_cents, item.quantity]);
      }
      await client.query('COMMIT');
      res.json({ orderId, url: '/checkout/simulation?order_id=' + orderId });
    } catch {
      if (client) await client.query('ROLLBACK').catch(() => {});
      res.status(503).json({ error: 'Unable to save your order. Please try again.' });
    } finally { client?.release(); }
  });

  router.get('/orders/:id', requireUser, async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (!uuid.test(req.params.id)) return res.status(404).json({ error: 'Order not found.' });
    try {
      const result = await db.query('SELECT id, status, total_cents, currency, payment_provider, created_at, paid_at FROM orders WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      if (!result.rowCount) return res.status(404).json({ error: 'Order not found.' });
      const items = await db.query('SELECT dish_name, quantity, unit_price_cents FROM "orderItems" WHERE order_id = $1 ORDER BY id', [req.params.id]);
      res.json({ ...result.rows[0], items: items.rows, simulation: result.rows[0].payment_provider === 'simulation' });
    } catch { res.status(503).json({ error: 'Unable to look up your order.' }); }
  });

  router.post('/payments/simulate', requireUser, requireOrigin, express.json({ limit: '4kb' }), async (req, res) => {
    const { orderId, outcome } = req.body || {};
    if (!uuid.test(orderId || '') || !['approved', 'declined'].includes(outcome)) return res.status(400).json({ error: 'Choose a valid simulated outcome.' });
    try {
      const result = await db.query("SELECT id, status, total_cents, currency, checkout_session_id FROM orders WHERE id = $1 AND user_id = $2 AND payment_provider = 'simulation'", [orderId, req.user.id]);
      if (!result.rowCount) return res.status(404).json({ error: 'Simulated order not found.' });
      const order = result.rows[0];
      const successUrl = '/checkout/success?order_id=' + order.id;
      if (order.status === 'paid') return res.json({ url: successUrl, simulation: true });
      if (outcome === 'declined') return res.json({ outcome: 'declined', simulation: true, message: 'Simulated payment declined. No charge was made. You can try again.' });
      // Take every payment field from PostgreSQL, never from the browser.
      const event = { id: randomUUID(), type: 'simulation.payment.completed', simulation: true,
        data: { orderId: order.id, sessionId: order.checkout_session_id, userId: req.user.id, amount: order.total_cents, currency: order.currency } };
      const body = JSON.stringify(event);
      // Actual server-to-server HTTP delivery to our simulated webhook endpoint.
      // No direct paid update is allowed here or on the browser success page.
      const delivery = await deliverWebhook(origin + '/api/payments/webhook', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Payment-Signature': signPaymentEvent(body, secret) },
        body, signal: AbortSignal.timeout(10000),
      });
      if (!delivery.ok) return res.status(503).json({ error: 'Confirmation is delayed. Please retry the simulation.' });
      res.json({ url: successUrl, simulation: true });
    } catch { res.status(503).json({ error: 'Unable to complete the simulation. Please try again.' }); }
  });
  return router;
}
