import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'package',
    lib: { entry: 'src/components/index.ts', formats: ['es'], fileName: 'prism' },
    rollupOptions: { external: ['lit', 'lit/directives/if-defined.js'] },
  },
});
