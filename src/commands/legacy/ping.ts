import { Message } from 'discord.js';
import { logger } from '../../utils/logger';

export default {
    name: 'ping',
    description: 'Check bot latency and response time',
    usage: 'ping',
    aliases: ['p', 'latency'],
    async execute(message: Message, args: string[]) {
        try {
            // Send initial response
            const sent = await message.reply('Pinging...');

            // Calculate round-trip latency
            const roundtripLatency = sent.createdTimestamp - message.createdTimestamp;
            
            // Get WebSocket latency
            const wsLatency = message.client.ws.ping;

            // Edit the message with detailed latency information
            await sent.edit(
                `🏓 Pong!\n` +
                `Roundtrip Latency: \`${roundtripLatency}ms\`\n` +
                `WebSocket Latency: \`${wsLatency}ms\``
            );
        } catch (error) {
            logger.error('Error in ping command:', error);
            await message.reply('❌ An error occurred while checking latency.');
        }
    }
};