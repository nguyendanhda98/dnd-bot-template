import { ButtonInteraction } from 'discord.js';

export default {
    id: 'voteButton',
    async execute(interaction: ButtonInteraction) {
        await interaction.reply('You clicked the vote button!');
    }
};
