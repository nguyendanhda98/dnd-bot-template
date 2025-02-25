import { Client, ClientOptions, Collection, GatewayIntentBits } from 'discord.js';
import { loadEvents } from '../loaders';
import { logger } from '../utils/logger';
import { connectDatabase } from '../services/database/prisma';

export class ExtendedClient extends Client {
  public commands: Collection<string, any> = new Collection();
  public buttons: Collection<string, any> = new Collection();
  public selectMenus: Collection<string, any> = new Collection();
  public modals: Collection<string, any> = new Collection();

  constructor(options: ClientOptions = {}) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
      ],
      ...options,
    });
  }

  async initialize() {
    // Connect to database
    try {
      await connectDatabase();
      logger.info('Connected to database');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
    }

    // Load events, commands, and interactions
    try {
      await loadEvents(this);
      logger.info('Events loaded');
      
      // These would be implemented in the loaders/index.ts
      // await loadCommands(this);
      // await loadInteractions(this);
    } catch (error) {
      logger.error('Error during initialization:', error);
      throw error;
    }

    return this;
  }
}
