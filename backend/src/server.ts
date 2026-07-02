import app from './app';
import { prisma } from './config/db';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // ponytail: check connection to db on startup
    await prisma.$connect();
    logger.info('Database connection established successfully');

    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    const shutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database disconnected. Process exited.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
