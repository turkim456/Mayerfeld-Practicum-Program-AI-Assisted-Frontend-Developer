import './env.js';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL in server/.env before connecting.');
}

// Verify the database server certificate for remote connections.
const connectionUrl = new URL(process.env.DATABASE_URL);
if (connectionUrl.hostname.endsWith('.neon.tech')) connectionUrl.searchParams.set('sslmode', 'verify-full');

export const db = new pg.Pool({
  connectionString: connectionUrl.toString(),
  max: 5,
  connectionTimeoutMillis: 15000,
});

db.on('error', () => console.error('An idle database connection failed.'));
