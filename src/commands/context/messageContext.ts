import { 
    ContextMenuCommandBuilder, 
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
    EmbedBuilder,
    TextChannel,
    ThreadChannel,
    DMChannel,
    MessageFlags,
} from 'discord.js';
import { logger } from '../../utils/logger';

export default {
    data: new ContextMenuCommandBuilder()
        .setName('Message Info')
        .setType(ApplicationCommandType.Message),

    async execute(interaction: MessageContextMenuCommandInteraction) {
        try {
            const targetMessage = interaction.targetMessage;
            const channel = targetMessage.channel;

            const embed = new EmbedBuilder()
                .setTitle('Message Information')
                .setColor('#0099ff')
                .addFields(
                    { name: 'Author', value: targetMessage.author?.tag || 'Unknown', inline: true },
                    { 
                        name: 'Channel', 
                        value: channel instanceof DMChannel ? 'Direct Message' :
                               `#${(channel as TextChannel | ThreadChannel).name}`, 
                        inline: true 
                    },
                    { name: 'Created At', value: targetMessage.createdAt.toLocaleString(), inline: true },
                    { name: 'Message ID', value: targetMessage.id, inline: true },
                    { name: 'Edited', value: targetMessage.editedAt ? 'Yes' : 'No', inline: true },
                    { name: 'Pinned', value: targetMessage.pinned ? 'Yes' : 'No', inline: true }
                );

            // Add message content if it exists
            if (targetMessage.content) {
                // Trim content if it's too long
                const content = targetMessage.content.length > 1024 
                    ? targetMessage.content.substring(0, 1021) + '...'
                    : targetMessage.content;
                embed.addFields({ name: 'Content', value: content });
            }

            // Add attachments info if any
            if (targetMessage.attachments.size > 0) {
                embed.addFields({
                    name: 'Attachments',
                    value: targetMessage.attachments.map(a => a.name).join(', ')
                });
            }

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral});
        } catch (error) {
            logger.error('Error executing message context command:', error);
            await interaction.reply({ 
                content: 'There was an error while fetching message information!', 
                flags: MessageFlags.Ephemeral
            });
        }
    }
};