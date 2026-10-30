import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Enables React JSX support and fast component updates during development.
  plugins: [react()],
});
