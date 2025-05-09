import {
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
} from "discord.js";
import { loadEvents, loadCommands, loadInteractions, loadLegacyCommands } from "../loaders";
import { logger } from "../utils/logger";

export class ExtendedClient extends Client {
  public commands: Collection<string, any> = new Collection();
  public buttons: Collection<string, any> = new Collection();
  public selectMenus: Collection<string, any> = new Collection();
  public modals: Collection<string, any> = new Collection();
  public legacyCommands: Collection<string, any> = new Collection();

  constructor(options: ClientOptions = { intents: [] }) {
    super({
      ...options,
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
  }

  async initialize() {
    try {
      await loadEvents(this);
      logger.info("Events loaded");

      await loadCommands(this);
      logger.info("Commands loaded");

      await loadLegacyCommands(this);
      logger.info("Legacy commands loaded");

      await loadInteractions(this);
      logger.info("Interactions loaded");
    } catch (error) {
      logger.error("Error during initialization:", error);
      throw error;
    }

    return this;
  }
}
