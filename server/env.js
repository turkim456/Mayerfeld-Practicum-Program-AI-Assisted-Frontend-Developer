import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const envFile = fileURLToPath(new URL('./.env', import.meta.url));
if (existsSync(envFile)) loadEnvFile(envFile);

for (const name of ['DATABASE_URL', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL', 'CLIENT_ORIGIN']) {
  if (!process.env[name]) throw new Error('Missing environment variable: ' + name);
}
if (process.env.BETTER_AUTH_SECRET.length < 32) {
  throw new Error('BETTER_AUTH_SECRET must contain at least 32 random characters.');
}
