import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function start() {
  const server = await createServer({
    root: __dirname,
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
  });
  await server.listen();
  console.log('HRSJM Dev Server is actively listening on http://localhost:5173/ and http://127.0.0.1:5173/');
  setInterval(() => {}, 60000);
}

start().catch((err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
