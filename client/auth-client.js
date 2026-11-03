import { createAuthClient } from 'better-auth/react';

// Uses the same origin as the website; Vite proxies /api during development.
export const authClient = createAuthClient();
