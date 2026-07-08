import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: 'src/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        projectDesign: resolve(__dirname, 'src/projectDesign.html'),
      },
    },
  },
});
