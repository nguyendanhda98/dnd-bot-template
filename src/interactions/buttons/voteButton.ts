import { ButtonInteraction } from 'discord.js';

module.exports = {
	name: 'voteButton',
	async execute(interaction: ButtonInteraction) {
		await interaction.reply('You clicked the vote button!');
	}
};
