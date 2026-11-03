import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
const names = await readdir('dist/assets');
let js = 0,
  css = 0,
  jsGzip = 0,
  cssGzip = 0;
for (const name of names) {
  const buffer = await readFile(`dist/assets/${name}`);
  if (name.endsWith('.js')) {
    js += buffer.length;
    jsGzip += gzipSync(buffer).length;
  }
  if (name.endsWith('.css')) {
    css += buffer.length;
    cssGzip += gzipSync(buffer).length;
  }
}
const pkg = await readFile('package/prism.js');
assert.ok(js < 150000, `Combined JS ${js} exceeds 150000 byte budget`);
assert.ok(css < 40000, `Combined CSS ${css} exceeds40000 byte budget`);
assert.ok(pkg.length < 30000, 'Library exceeds30000 byte budget');
console.log(
  JSON.stringify(
    {
      combinedDocsAndExample: { js, jsGzip, css, cssGzip },
      libraryExcludingLit: { bytes: pkg.length, gzip: gzipSync(pkg).length },
    },
    null,
    2,
  ),
);
