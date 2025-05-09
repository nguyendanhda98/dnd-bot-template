import { Events, Message } from 'discord.js';
import { ExtendedClient } from '../../structures/ExtendedClient';
import { config } from '../../config/config';
import { logger } from '../../utils/logger';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    try {
      // Ignore messages from bots
      if (message.author.bot) return;

      const client = message.client as ExtendedClient;
      const prefix = config.prefix || '!';

      // Check if message starts with prefix
      if (!message.content.startsWith(prefix)) return;

      // Split message into command and arguments
      const args = message.content.slice(prefix.length).trim().split(/\s+/);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) return;

      // Get command from collection
      const command = client.legacyCommands.get(commandName) || 
                     client.legacyCommands.find(cmd => cmd.aliases?.includes(commandName));

      if (!command) {
        logger.warn(`Legacy command ${commandName} not found`);
        return;
      }

      try {
        await command.execute(message, args);
      } catch (error) {
        logger.error(`Error executing legacy command ${commandName}:`, error);
        await message.reply('❌ There was an error executing that command.');
      }
    } catch (error) {
      logger.error('Error in message create event:', error);
    }
  }
};