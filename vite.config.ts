import { defineConfig } from 'vite';
export default defineConfig({
  base: '/prism-web-components/',
  build: {
    target: 'es2022',
    rollupOptions: { input: { main: 'index.html', example: 'examples/index.html' } },
  },
});
