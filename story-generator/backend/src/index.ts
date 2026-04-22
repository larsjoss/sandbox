import { config } from './config';
import { createApp } from './app';
import { prisma } from './lib/prisma';

async function main() {
  await prisma.$connect();

  const app = createApp();

  const server = app.listen(config.PORT, () => {
    console.log(`Backend running on port ${config.PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
