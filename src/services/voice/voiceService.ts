import {
  joinVoiceChannel,
  createAudioPlayer,
  VoiceConnectionStatus,
  entersState,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  getVoiceConnection,
} from "@discordjs/voice";
import { VoiceBasedChannel, GuildMember } from "discord.js";
import { logger } from "../../utils/logger";

// Store active voice connections by guild ID
const voiceConnections = new Map();

/**
 * Join a voice channel and return the connection
 * @param channel Voice channel to join
 * @param member Guild member initiating the join request
 */
export const joinChannel = async (
  channel: VoiceBasedChannel,
  member: GuildMember
) => {
  try {
    let connection = getVoiceConnection(channel.guild.id);

    if (!connection) {
      // Create a connection to the voice channel
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      // Create an audio player
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      // Subscribe the connection to the audio player
      const subscription = connection.subscribe(player);

      // Store the connection, player, and subscription
      voiceConnections.set(channel.guild.id, {
        connection,
        player,
        subscription,
        channelId: channel.id,
      });

      // Set up connection event listeners
      connection.on(VoiceConnectionStatus.Ready, () => {
        logger.info(`Voice connection ready in guild ${channel.guild.id}`);
      });

      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          // Try to reconnect if disconnected unexpectedly
          await Promise.race([
            entersState(connection!, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection!, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        } catch (error) {
          // If reconnection fails, destroy the connection
          if (connection) {
            connection.destroy();
          }
          voiceConnections.delete(channel.guild.id);
          logger.info(
            `Voice connection disconnected in guild ${channel.guild.id}`
          );
        }
      });

      // Wait for the connection to be ready
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      return { success: true, connection };
    }
  } catch (error) {
    logger.error("Error joining voice channel:", error);
    return { success: false, error };
  }
};

/**
 * Leave a voice channel and clean up resources
 * @param guildId ID of the guild to leave voice in
 */
export const leaveChannel = (guildId: string) => {
  const voiceData = voiceConnections.get(guildId);

  if (voiceData) {
    const { connection, subscription } = voiceData;

    // Clean up resources
    subscription?.unsubscribe();
    connection.destroy();
    voiceConnections.delete(guildId);

    return { success: true };
  }

  return { success: false, error: "Not connected to a voice channel" };
};

/**
 * Check if the bot is connected to a voice channel in the guild
 * @param guildId ID of the guild to check
 */
export const isConnectedToVoice = (guildId: string) => {
  const connection = getVoiceConnection(guildId);
  return !!connection;
};

/**
 * Get the current voice data for a guild
 * @param guildId ID of the guild to get voice data for
 */
export const getVoiceData = (guildId: string) => {
  return voiceConnections.get(guildId);
};

/**
 * Auto-leave voice channel if it's empty (no users except the bot)
 * @param channel Voice channel to check
 */
export const handleEmptyChannel = (channel: VoiceBasedChannel) => {
  // Count members in the channel (excluding bots)
  const humanMembers = channel.members.filter((member) => !member.user.bot);

  // If there are no human members left, leave the channel
  if (humanMembers.size === 0) {
    logger.info(`No users left in voice channel ${channel.id}, leaving...`);
    leaveChannel(channel.guild.id);
    return true;
  }

  return false;
};
