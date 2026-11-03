import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { build } from 'vite';
const root = process.cwd();
const consumer = await mkdtemp(join(tmpdir(), 'prism-consumer-'));
try {
  await mkdir(join(consumer, 'node_modules/@khalilbenali'), { recursive: true });
  await symlink(root, join(consumer, 'node_modules/@khalilbenali/prism-web-components'), 'dir');
  await writeFile(
    join(consumer, 'index.html'),
    '<html><script type="module" src="/main.ts"></script><prism-button>Consumer works</prism-button></html>',
  );
  await writeFile(
    join(consumer, 'main.ts'),
    `import {PrismButton,PrismDialog,PrismTextField} from '@khalilbenali/prism-web-components';\nimport '@khalilbenali/prism-web-components/tokens.css';\nconst button:PrismButton=document.createElement('prism-button');button.variant='secondary';\nconst dialog:PrismDialog=document.createElement('prism-dialog');dialog.show();\nconst input:PrismTextField=document.createElement('prism-text-field');input.value='Consumer';\ndocument.body.append(button,dialog,input);`,
  );
  execFileSync(
    process.execPath,
    [
      resolve('node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--moduleResolution',
      'bundler',
      '--module',
      'esnext',
      '--target',
      'es2022',
      join(consumer, 'main.ts'),
    ],
    { stdio: 'inherit', cwd: consumer },
  );
  await build({
    configFile: false,
    root: consumer,
    logLevel: 'warn',
    build: { outDir: join(consumer, 'dist'), emptyOutDir: true },
  });
  console.log(
    'External consumer: package exports, declarations, registration and stylesheet bundle successfully.',
  );
} finally {
  await rm(consumer, { recursive: true, force: true });
}
