import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('all twelve public element types are registered and exported', async () => {
  const source = await readFile('src/components/index.ts', 'utf8');
  const tags = [...source.matchAll(/'prism-[\w-]+':/g)].map((m) => m[0]);
  assert.equal(new Set(tags).size, 12);
  assert.match(source, /export type.*PrismValueDetail/);
});
test('package exports declarations and explicit theme stylesheet', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(pkg.exports['.'].types, './package/index.d.ts');
  assert.equal(pkg.exports['./tokens.css'], './package/tokens.css');
  assert.equal(pkg.private, true);
});
