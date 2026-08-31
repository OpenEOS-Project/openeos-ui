import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { defineConfig } from 'tsup';

const STYLE_ROOT = resolve('src/styles');

/** Inlines @import statements so consumers get one flat stylesheet. */
function bundleCss(entry: string, seen = new Set<string>()): string {
  const file = resolve(entry);
  if (seen.has(file)) return '';
  seen.add(file);

  return readFileSync(file, 'utf8').replace(
    /^@import\s+["']([^"']+)["'];\s*$/gm,
    (_match, spec: string) => bundleCss(join(dirname(file), spec), seen),
  );
}

export default defineConfig({
  // src/fonts.ts fehlt hier bewusst: next/font-Aufrufe müssen als
  // const im Quelltext ankommen, Bundling macht daraus var und das
  // Font-Plugin von Next bricht ab. Das Modul wird als Quelle
  // ausgeliefert (siehe exports['./fonts']).
  entry: ['src/index.ts', 'src/tokens.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react/jsx-runtime', 'next', 'next/font/google'],
  async onSuccess() {
    writeFileSync('dist/styles.css', bundleCss(join(STYLE_ROOT, 'index.css')));
  },
});
