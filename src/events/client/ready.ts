import { Events } from 'discord.js';
import { ExtendedClient } from '../../structures/ExtendedClient';
import { logger } from '../../utils/logger';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ExtendedClient) {
    logger.info(`Ready! Logged in as ${client.user?.tag}`);
    
    // Set bot status
    client.user?.setActivity('voice channels', { type: 2 }); // 2 is "Listening to"
  }
};