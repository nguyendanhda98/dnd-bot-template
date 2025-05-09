import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot to check if it's alive"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
      await interaction.editReply({
        content: "🏓 Pong! The bot is alive and responding.",
      });
    } catch (error) {
      console.error("Error sending ping response:", error);
      await interaction.editReply({
        content: "❌ An error occurred while checking the bot's status.",
      });
    }
  },
};
