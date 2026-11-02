import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { once } from 'node:events';
import { app } from '../app.js';
import { db } from '../db.js';

let server;
let baseURL;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseURL = 'http://127.0.0.1:' + server.address().port;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  await db.end();
});

test('health confirms a real database connection', async () => {
  const response = await fetch(baseURL + '/api/health');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).database, 'connected');
});

test('menu API returns all database dishes with numeric prices', async () => {
  const response = await fetch(baseURL + '/api/dishes');
  assert.equal(response.status, 200);
  const dishes = await response.json();
  const result = await db.query('SELECT id FROM dishes ORDER BY id');
  assert.ok(dishes.length > 0, 'Run db:seed first');
  assert.deepEqual(dishes.map(dish => dish.id), result.rows.map(row => row.id));
  assert.ok(dishes.every(dish => typeof dish.price === 'number' && dish.image.startsWith('/images/')));
});

test('unknown API routes return JSON 404', async () => {
  const response = await fetch(baseURL + '/api/not-a-route');
  assert.equal(response.status, 404);
  assert.ok((await response.json()).error);
});
