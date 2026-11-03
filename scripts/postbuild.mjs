import { copyFile, cp } from 'node:fs/promises';
await copyFile('public/404.html', 'dist/404.html');
await cp('package', 'dist/package', { recursive: true });
