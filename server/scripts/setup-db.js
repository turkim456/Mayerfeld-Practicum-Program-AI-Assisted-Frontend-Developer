import { readFile } from 'node:fs/promises';
import { getMigrations } from 'better-auth/db/migration';
import { db } from '../db.js';

try {
  // Better Auth creates and manages its own user/account/session tables.
  const { runMigrations } = await getMigrations({
    database: db,
    emailAndPassword: { enabled: true },
  });
  await runMigrations();
  await db.query(await readFile(new URL('../schema.sql', import.meta.url), 'utf8'));
  const result = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('Database tables:', result.rows.map(row => row.table_name).join(', '));
} catch {
  console.error('Database setup failed. Check DATABASE_URL and database availability.');
  process.exitCode = 1;
} finally {
  await db.end();
}
