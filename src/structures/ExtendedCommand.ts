import { 
  SlashCommandBuilder, 
  CommandInteraction, 
  PermissionResolvable,
  ChatInputCommandInteraction 
} from 'discord.js';

interface CommandOptions {
  name: string;
  description: string;
  permissions?: PermissionResolvable[];
  cooldown?: number; // in seconds
  category?: string;
  ownerOnly?: boolean;
}

export abstract class ExtendedCommand {
  public name: string;
  public description: string;
  public permissions: PermissionResolvable[];
  public cooldown: number;
  public category: string;
  public ownerOnly: boolean;
  
  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.permissions = options.permissions || [];
    this.cooldown = options.cooldown || 0;
    this.category = options.category || 'Miscellaneous';
    this.ownerOnly = options.ownerOnly || false;
  }

  // This will be used to build the slash command data
  abstract buildSlashCommand(): SlashCommandBuilder;

  // This will be executed when the slash command is run
  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
