import { Events, Interaction, MessageFlags } from 'discord.js';
import { ExtendedClient } from '../../structures/ExtendedClient';
import { logger } from '../../utils/logger';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    const client = interaction.client as ExtendedClient;

    try {
      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
          logger.warn(`Command ${interaction.commandName} not found`);
          return await interaction.reply({ 
            content: 'This command doesn\'t exist or isn\'t loaded properly.', 
            flags: MessageFlags.Ephemeral
          });
        }
        
        await command.execute(interaction);
      } 
      // Handle button interactions
      else if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        
        if (button) {
          await button.execute(interaction);
        }
      } 
      // Handle select menu interactions
      else if (interaction.isStringSelectMenu()) {
        const selectMenu = client.selectMenus.get(interaction.customId);
        
        if (selectMenu) {
          await selectMenu.execute(interaction);
        }
      } 
      // Handle modal submissions
      else if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);
        
        if (modal) {
          await modal.execute(interaction);
        }
      }
      // Handle context menu commands
      else if (interaction.isContextMenuCommand()) {
        const contextCommand = client.commands.get(interaction.commandName);
        
        if (contextCommand) {
          await contextCommand.execute(interaction);
        }
      }
    } catch (error) {
      logger.error('Error handling interaction:', error);
      
      // Reply to the interaction if it hasn't been replied to already
      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: 'There was an error while executing this interaction!', 
          flags: MessageFlags.Ephemeral
        });
      } else if (interaction.isRepliable() && !interaction.replied && interaction.deferred) {
        await interaction.editReply('There was an error while executing this interaction!');
      }
    }
  }
};
