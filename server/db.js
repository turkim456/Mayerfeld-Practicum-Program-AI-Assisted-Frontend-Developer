import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL in server/.env before connecting.');
}

export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 15000,
});

db.on('error', () => console.error('An idle database connection failed.'));
