import { createApp } from './app';

console.log('⏳ Booting up AI Service...');
// await aiService.initialize();

// 2. Buat App dengan Service Asli
const app = createApp();

// 3. Baru Listen Port
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
