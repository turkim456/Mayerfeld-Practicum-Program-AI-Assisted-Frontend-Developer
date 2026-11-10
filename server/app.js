import { createHmac } from 'node:crypto';
import { paymentRouter } from './payments.js';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import { db } from './db.js';

export const app = express();
app.disable('x-powered-by');

// Better Auth handles passwords, session cookies, and request bodies.
app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/api/health', async (request, response) => {
  try {
    await db.query('SELECT 1');
    response.json({ status: 'ok', database: 'connected' });
  } catch {
    response.status(503).json({ error: 'Database is unavailable.' });
  }
});

app.get('/api/dishes', async (request, response) => {
  try {
    const result = await db.query('SELECT id, category, name, description, price, image, alt, width, height FROM dishes ORDER BY id');
    response.json(result.rows.map(dish => ({ ...dish, price: Number(dish.price) })));
  } catch {
    response.status(503).json({ error: 'The menu is temporarily unavailable.' });
  }
});

// A separate signing key is derived from the existing server-only auth secret.
const paymentSecret = createHmac('sha256', process.env.BETTER_AUTH_SECRET).update('savora.payment-simulation.v1').digest('hex');
app.use('/api', paymentRouter({ db, auth, origin: process.env.CLIENT_ORIGIN, secret: paymentSecret }));

app.use('/api', (request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

// Serve the built React app and API from the same public URL.
if (process.env.NODE_ENV === 'production') {
  const clientDist = fileURLToPath(new URL('../client/dist/', import.meta.url));
  app.use(express.static(clientDist));
  app.get('/{*path}', (request, response) => {
    response.sendFile('index.html', { root: clientDist });
  });
}
