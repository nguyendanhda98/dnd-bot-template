import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import {
  leaveChannel,
  isConnectedToVoice,
} from "../../../services/voice/voiceService";
import { logger } from "../../../utils/logger";

export default {
  data: new SlashCommandBuilder()
    .setName("ai-leave")
    .setDescription("Leave the current voice channel"),
  async execute(interaction: ChatInputCommandInteraction) {
    // Defer reply to give us time to process
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    // Check if the user is in a voice channel
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;
    const guildId = interaction.guildId;

    try {
      // Check if user is in a voice channel
      if (!interaction.member || !voiceChannel) {
        return interaction.editReply({
          content: "You need to be in a voice channel for me to leave!",
        });
      }
      if (!guildId) {
        return interaction.editReply({
          content: "❌ Guild ID is not available.",
        });
      }

      // Check if bot is in a voice channel
      if (!isConnectedToVoice(guildId)) {
        return interaction.editReply({
          content: "I'm not currently in a voice channel!",
        });
      }

      // Leave the voice channel
      const result = leaveChannel(guildId);

      if (result.success) {
        await interaction.editReply({
          content: "👋 Successfully left the voice channel!",
        });
      } else {
        logger.error("Failed to leave voice channel:", result.error);
        await interaction.editReply({
          content:
            "❌ Failed to leave the voice channel. Please try again later.",
        });
      }
    } catch (error) {
      logger.error("Error executing ai-leave command:", error);

      await interaction.editReply({
        content:
          "❌ An error occurred while trying to leave the voice channel.",
      });
    }
  },
};
