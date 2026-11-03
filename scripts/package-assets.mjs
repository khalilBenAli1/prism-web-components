import { copyFile } from 'node:fs/promises';
await copyFile('src/tokens.css', 'package/tokens.css');
