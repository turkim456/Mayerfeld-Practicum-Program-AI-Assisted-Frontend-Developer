import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Enables React JSX support and fast component updates during development.
  plugins: [react(), tailwindcss()],
});
