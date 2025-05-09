// File entry point của bot
import { ExtendedClient } from './structures/ExtendedClient';
import { config } from './config/config';
import { logger } from './utils/logger';

// Create a new instance of our client
const client = new ExtendedClient();

// Handle process termination and cleanup
const handleShutdown = async () => {
  logger.info('Shutting down...');
  
  // Destroy the client
  client.destroy();
  
  process.exit(0);
};

// Handle process signals for graceful shutdown
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  handleShutdown();
});

// Initialize the client
(async () => {
  try {
    // Initialize client (load events, commands, interactions)
    await client.initialize();
    
    // Login to Discord with the bot token
    await client.login(config.token);
  } catch (error) {
    logger.error('Failed to start the bot:', error);
    process.exit(1);
  }
})();