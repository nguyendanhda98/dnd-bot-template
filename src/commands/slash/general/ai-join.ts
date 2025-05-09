import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { joinChannel } from "../../../services/voice/voiceService";
import { logger } from "../../../utils/logger";

export default {
  data: new SlashCommandBuilder()
    .setName("ai-join")
    .setDescription("Join your current voice channel"),
  async execute(interaction: ChatInputCommandInteraction) {
    // Defer reply to give us time to join the channel
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    try {
      // Check if user is in a voice channel
      if (!interaction.member || !voiceChannel) {
        return interaction.editReply({
          content: "You need to be in a voice channel for me to join!",
        });
      }

      // Join the user's voice channel
      const result = await joinChannel(voiceChannel, member);

      if (result && result.success) {
        await interaction.editReply({
          content: `✅ Successfully joined ${voiceChannel.name}!`,
        });
      } else {
        await interaction.editReply({
          content:
            "❌ Failed to join the voice channel. Please try again later.",
        });
      }
    } catch (error) {
      logger.error("Error executing ai-join command:", error);

      await interaction.editReply({
        content: "❌ An error occurred while trying to join the voice channel.",
      });
    }
  },
};
