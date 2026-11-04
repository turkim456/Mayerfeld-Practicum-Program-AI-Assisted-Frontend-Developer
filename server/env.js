import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const envFile = fileURLToPath(new URL('./.env', import.meta.url));
if (existsSync(envFile)) loadEnvFile(envFile);

// Render supplies the public URL, so cookies and requests share one origin.
if (process.env.RENDER_EXTERNAL_URL) {
  process.env.BETTER_AUTH_URL ||= process.env.RENDER_EXTERNAL_URL;
  process.env.CLIENT_ORIGIN ||= process.env.RENDER_EXTERNAL_URL;
}

for (const name of ['DATABASE_URL', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL', 'CLIENT_ORIGIN']) {
  if (!process.env[name]) throw new Error('Missing environment variable: ' + name);
}
if (process.env.BETTER_AUTH_SECRET.length < 32) {
  throw new Error('BETTER_AUTH_SECRET must contain at least 32 random characters.');
}
