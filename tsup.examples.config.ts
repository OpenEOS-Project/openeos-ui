import { defineConfig } from 'tsup';

/* Spielwiese unter examples/: React wird mitgebündelt, damit die Seite
   ohne Server-Rendering und ohne externe Quellen läuft (examples/dist
   ist nicht eingecheckt — vorher `pnpm build && pnpm examples`). */
export default defineConfig({
  entry: { admin: 'examples/admin.tsx' },
  outDir: 'examples/dist',
  format: ['iife'],
  platform: 'browser',
  noExternal: [/.*/],
  define: { 'process.env.NODE_ENV': '"development"' },
  sourcemap: true,
  clean: true,
});
