import dotenv from 'dotenv';
import { environment } from './environment';

// Load environment variables
dotenv.config();

interface Config {
  token: string;
  clientId: string;
  guildIdTest: string;
  roleIdTest: string;
  prefix?: string;
  environment: string;
}

// Export configuration with environment variables
export const config: Config = {
  token: process.env.DISCORD_BOT_TOKEN || '',
  clientId: process.env.DISCORD_CLIENT_ID || '',
  guildIdTest: process.env.DISCORD_GUILD_ID_TEST || '',
  roleIdTest: process.env.DISCORD_ROLE_ID_TESTER || '',
  prefix: process.env.BOT_PREFIX || '!',
  environment: environment.current,
};