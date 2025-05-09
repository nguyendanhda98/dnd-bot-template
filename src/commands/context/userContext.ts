import { 
    ContextMenuCommandBuilder, 
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
    EmbedBuilder,
    GuildMember,
} from 'discord.js';
import { logger } from '../../utils/logger';

export default {
    data: new ContextMenuCommandBuilder()
        .setName('User Info')
        .setType(ApplicationCommandType.User),

    async execute(interaction: UserContextMenuCommandInteraction) {
        try {
            const targetUser = interaction.targetUser;
            const targetMember = interaction.targetMember as GuildMember | null;

            const embed = new EmbedBuilder()
                .setTitle('User Information')
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: 'Username', value: targetUser.username, inline: true },
                    { name: 'User ID', value: targetUser.id, inline: true },
                    { name: 'Account Created', value: targetUser.createdAt.toLocaleDateString(), inline: true },
                )
                .setColor('#00ff00');

            // Add member-specific information if in a guild
            if (interaction.inGuild() && targetMember) {
                const roles = targetMember.roles.cache
                    .filter(role => role.name !== '@everyone')
                    .map(role => role.name)
                    .join(', ');

                embed.addFields(
                    { name: 'Nickname', value: targetMember.displayName || 'None', inline: true },
                    { name: 'Joined Server', value: targetMember.joinedAt?.toLocaleDateString() || 'Unknown', inline: true },
                    { name: 'Roles', value: roles || 'None' }
                );
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            logger.error('Error executing user context command:', error);
            await interaction.reply({ 
                content: 'There was an error while fetching user information!', 
                ephemeral: true 
            });
        }
    }
};