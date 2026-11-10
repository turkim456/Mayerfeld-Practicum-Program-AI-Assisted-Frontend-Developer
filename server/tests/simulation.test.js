import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { db } from '../db.js';
import { paymentRouter, signPaymentEvent, verifyPaymentEvent } from '../payments.js';

const secret = 'simulation-test-secret-at-least-32-characters';

test('event signatures reject forged, altered and expired payloads', () => {
  const body = Buffer.from('{"simulation":true}');
  const header = signPaymentEvent(body, secret);
  assert.equal(verifyPaymentEvent(body, header, secret), true);
  assert.equal(verifyPaymentEvent(Buffer.from('{}'), header, secret), false);
  assert.equal(verifyPaymentEvent(body, signPaymentEvent(body, 'different-secret'), secret), false);
  assert.equal(verifyPaymentEvent(body, signPaymentEvent(body, secret, Math.floor(Date.now() / 1000) - 600), secret), false);
  assert.equal(verifyPaymentEvent(body, null, secret), false);
});

test('simulation flow uses real PostgreSQL and a real signed HTTP webhook', async t => {
  const owner = 'simulation-test-' + randomUUID();
  let currentUser = null, orderId, savedOrder, base, deliveryBody, deliveryHeaders;
  const app = express();
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = 'http://127.0.0.1:' + server.address().port;
  app.use('/api', paymentRouter({ db, secret, origin: base,
    auth: { api: { getSession: async () => currentUser ? { user: { id: currentUser } } : null } },
    deliverWebhook: async (url, options) => { deliveryBody = options.body; deliveryHeaders = options.headers; return fetch(url, options); },
  }));
  const post = (route, body, origin = base) => fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
  const status = async () => (await db.query('SELECT status, paid_at, payment_event_id FROM orders WHERE id = $1', [orderId])).rows[0];
  try {
    await db.query('INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") VALUES ($1, $2, $3, false, NOW(), NOW())', [owner, 'Simulation Test', owner + '@example.invalid']);
    const dish = (await db.query('SELECT id, name, (price * 100)::integer AS cents FROM dishes WHERE price >= 0.50 ORDER BY id LIMIT 1')).rows[0];
    assert.ok(dish, 'Seed menu first');
    await t.test('anonymous checkout and order lookup are blocked', async () => {
      assert.equal((await post('/api/checkout', { items: [{ dishId: dish.id, quantity: 1 }] })).status, 401);
      assert.equal((await fetch(base + '/api/orders/' + randomUUID())).status, 401);
      assert.equal((await post('/api/payments/simulate', { orderId: randomUUID(), outcome: 'approved' })).status, 401);
    });
    currentUser = owner;
    await t.test('invalid quantities, duplicates and foreign origins are rejected', async () => {
      for (const quantity of [0, -1, 100, 1.5, '2']) assert.equal((await post('/api/checkout', { items: [{ dishId: dish.id, quantity }] })).status, 400);
      assert.equal((await post('/api/checkout', { items: [{ dishId: dish.id, quantity: 1 }, { dishId: dish.id, quantity: 1 }] })).status, 400);
      assert.equal((await post('/api/checkout', { items: [{ dishId: dish.id, quantity: 1 }] }, 'https://other.example')).status, 403);
    });
    await t.test('checkout ignores browser prices and snapshots a pending order', async () => {
      const response = await post('/api/checkout', { items: [{ dishId: dish.id, quantity: 2, price: 1 }], total: 1 });
      assert.equal(response.status, 200);
      const result = await response.json(); orderId = result.orderId;
      assert.equal(result.url, '/checkout/simulation?order_id=' + orderId);
      savedOrder = (await db.query('SELECT * FROM orders WHERE id = $1', [orderId])).rows[0];
      assert.equal(savedOrder.status, 'pending');
      assert.equal(savedOrder.total_cents, dish.cents * 2);
      assert.equal(savedOrder.payment_provider, 'simulation');
      assert.equal(savedOrder.currency, 'sar');
      const line = (await db.query('SELECT * FROM "orderItems" WHERE order_id = $1', [orderId])).rows[0];
      assert.equal(line.unit_price_cents, dish.cents);
      assert.equal(line.dish_name, dish.name);
    });
    await t.test('another user cannot view or complete this order', async () => {
      currentUser = 'someone-else';
      assert.equal((await fetch(base + '/api/orders/' + orderId)).status, 404);
      assert.equal((await post('/api/payments/simulate', { orderId, outcome: 'approved' })).status, 404);
      currentUser = owner;
    });
    await t.test('decline and a read-only success lookup cannot mark an order paid', async () => {
      const response = await post('/api/payments/simulate', { orderId, outcome: 'declined' });
      assert.equal((await response.json()).outcome, 'declined');
      const order = await (await fetch(base + '/api/orders/' + orderId)).json();
      assert.equal(order.status, 'pending');
      assert.equal(order.simulation, true);
      assert.equal((await status()).status, 'pending');
    });
    await t.test('unsigned and signed mismatched events cannot mark an order paid', async () => {
      assert.equal((await post('/api/payments/webhook', { status: 'paid' })).status, 400);
      const event = { id: randomUUID(), type: 'simulation.payment.completed', simulation: true,
        data: { orderId, sessionId: savedOrder.checkout_session_id, userId: owner, amount: 1, currency: 'sar' } };
      let body = JSON.stringify(event);
      // Wrong amount at a syntactically valid minimum, then wrong session/owner/currency.
      for (const fields of [{ amount: savedOrder.total_cents + 1 }, { amount: savedOrder.total_cents, sessionId: randomUUID() }, { amount: savedOrder.total_cents, userId: 'someone-else' }]) {
        body = JSON.stringify({ ...event, data: { ...event.data, ...fields } });
        const response = await fetch(base + '/api/payments/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Payment-Signature': signPaymentEvent(body, secret) }, body });
        assert.equal(response.status, 409);
      }
      assert.equal((await status()).status, 'pending');
    });
    await t.test('approval delivers a signed HTTP event and confirms the saved amount', async () => {
      const response = await post('/api/payments/simulate', { orderId, outcome: 'approved', amount: 1, currency: 'usd' });
      assert.equal(response.status, 200);
      assert.equal((await response.json()).url, '/checkout/success?order_id=' + orderId);
      assert.equal(JSON.parse(deliveryBody).data.amount, savedOrder.total_cents);
      assert.equal((await status()).status, 'paid');
    });
    await t.test('duplicate delivery retains the original payment timestamp and event', async () => {
      const before = await status();
      const response = await fetch(base + '/api/payments/webhook', { method: 'POST', headers: deliveryHeaders, body: deliveryBody });
      assert.equal(response.status, 200);
      const after = await status();
      assert.equal(after.paid_at.toISOString(), before.paid_at.toISOString());
      assert.equal(after.payment_event_id, before.payment_event_id);
      assert.equal((await post('/api/payments/simulate', { orderId, outcome: 'approved' })).status, 200);
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
    await db.query('DELETE FROM orders WHERE user_id = $1', [owner]);
    await db.query('DELETE FROM "user" WHERE id = $1', [owner]);
    await db.end();
  }
});
