import { copyFile, writeFile } from 'node:fs/promises';
await copyFile('src/tokens.css', 'package/tokens.css');

await writeFile('package/tokens.d.ts', 'export {};\n');
