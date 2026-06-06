#!/usr/bin/env node
/**
 * Reports gzipped bundle sizes for publishable packages.
 * Run after `pnpm build`.
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const packages = [
  { name: '@zineddinebk/grid-core', path: 'packages/core/dist/index.js' },
  { name: '@zineddinebk/grid-react', path: 'packages/react/dist/index.js' },
  { name: '@zineddinebk/grid-vue', path: 'packages/vue/dist/index.js' },
  { name: '@zineddinebk/grid-tailwind-preset', path: 'packages/tailwind-preset/dist/index.js' },
];

function kb(bytes) {
  return (bytes / 1024).toFixed(2);
}

function gzipSize(filePath) {
  const buf = readFileSync(filePath);
  return gzipSync(buf).length;
}

console.log('| Package | Raw (KB) | Gzip (KB) |');
console.log('|---------|----------|-----------|');

for (const pkg of packages) {
  const full = resolve(root, pkg.path);
  try {
    const raw = statSync(full).size;
    const gz = gzipSize(full);
    console.log(`| ${pkg.name} | ${kb(raw)} | ${kb(gz)} |`);
  } catch {
    console.log(`| ${pkg.name} | — | — (run pnpm build first) |`);
  }
}

console.log('\nReference (approximate, from npm bundlephobia):');
console.log('| Library | Gzip (KB) |');
console.log('|---------|-----------|');
console.log('| @tanstack/react-table (headless) | ~14 |');
console.log('| ag-grid-community (minimal) | ~180+ |');
