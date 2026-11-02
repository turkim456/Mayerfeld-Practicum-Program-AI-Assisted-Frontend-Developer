import { readFile } from 'node:fs/promises';
import { db } from '../db.js';

const dishes = JSON.parse(await readFile(new URL('../data/dishes.json', import.meta.url), 'utf8'));
let connection;
try {
  connection = await db.connect();
  await connection.query('BEGIN');
  for (const dish of dishes) {
    // Parameters keep values separate from SQL. Re-running updates the same ids.
    await connection.query(
      `INSERT INTO dishes (id, category, name, description, price, image, alt, width, height)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         category = EXCLUDED.category, name = EXCLUDED.name,
         description = EXCLUDED.description, price = EXCLUDED.price,
         image = EXCLUDED.image, alt = EXCLUDED.alt,
         width = EXCLUDED.width, height = EXCLUDED.height`,
      [dish.id, dish.category, dish.name, dish.description, dish.price, dish.image, dish.alt, dish.width, dish.height]
    );
  }
  await connection.query('COMMIT');
  console.log('Seeded ' + dishes.length + ' dishes into PostgreSQL.');
} catch {
  if (connection) await connection.query('ROLLBACK');
  console.error('Seeding failed. Check database setup and connectivity.');
  process.exitCode = 1;
} finally {
  connection?.release();
  await db.end();
}
