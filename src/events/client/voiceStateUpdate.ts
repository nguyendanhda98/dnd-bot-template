import { Events, VoiceState } from 'discord.js';
import { ExtendedClient } from '../../structures/ExtendedClient';
import { handleEmptyChannel, getVoiceData } from '../../services/voice/voiceService';
import { logger } from '../../utils/logger';

export default {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState: VoiceState, newState: VoiceState, client: ExtendedClient) {
    try {
      const guildId = oldState.guild.id;
      const voiceData = getVoiceData(guildId);
      
      // If we don't have voice data for this guild, we're not in a voice channel
      if (!voiceData) return;
      
      // Get the channel we're connected to
      const botChannelId = voiceData.channelId;
      
      // If a user left the channel we're in
      if (oldState.channelId === botChannelId && newState.channelId !== botChannelId) {
        // Check if the channel is now empty (except for the bot)
        const channel = oldState.channel;
        
        if (channel) {
          handleEmptyChannel(channel);
        }
      }
    } catch (error) {
      logger.error('Error handling voice state update:', error);
    }
  }
};