import { betterAuth } from 'better-auth';
import { db } from './db.js';

export const auth = betterAuth({
  database: db,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.CLIENT_ORIGIN],
  emailAndPassword: { enabled: true },
  rateLimit: { enabled: true },
});
