import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'vite-ts',
      entry: resolve(__dirname, './src/server.ts'),
      formats: ['cjs'],
      fileName: module => {
        return 'server.js'
      },
    }
  },
})