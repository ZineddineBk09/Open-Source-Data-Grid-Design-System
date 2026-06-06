import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/Open-Source-Data-Grid-Design-System/',
  plugins: [react()],
  resolve: {
    alias: {
      '@zineddinebk09/grid-react': resolve(__dirname, '../../packages/react/src'),
      '@zineddinebk09/grid-core': resolve(__dirname, '../../packages/core/src'),
    },
  },
});
