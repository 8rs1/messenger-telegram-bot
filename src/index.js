import { ADMIN_ID } from './constants.js';
import { isAnswerStateActive } from './utils/state.js';
import { handleCallbackQuery } from './handlers/callback.js';
import { handleStartCommand, handleUserMessageToAdmin, handleInvalidMessage } from './handlers/message.js';
import { handleAdminReply } from './handlers/admin.js';
import { sendMessage } from './api/telegram.js';

export default {
	async fetch(request, env, ctx) {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const update = await request.json();
			const token = env.BOT_TOKEN;

			// Handle callback query
			if (update.callback_query) {
				await handleCallbackQuery(token, update);
				return new Response('OK');
			}
			// Handle messages
			if (update.message) {
				const { message } = update;
				if (message.text) {
					// /start command
					if (message.text.toLowerCase() === '/start') {
						await handleStartCommand(token, message);
						return new Response('OK');
					}
					// Admin answer to user
					if (isAnswerStateActive() && message.chat.id.toString() === ADMIN_ID.toString()) {
						await handleAdminReply(token, message);
						return new Response('OK');
					}

					// Send user message to admin
					if (message.from.id.toString() !== ADMIN_ID.toString()) {
						await handleUserMessageToAdmin(token, message);
						return new Response('OK');
					}
					// Handle admin invalid message
					await handleInvalidMessage(token, message);
					return new Response('Logic response');
				}
			}
			return new Response('OK');
		} catch (err) {
			console.error('Error:', err);
			// Send error to admin
			try {
				await sendMessage(env.BOT_TOKEN, ADMIN_ID, `Error: ${err.message}`);
			} catch (botErr) {
				console.error('Failed to send error to admin:', botErr);
			}
			return new Response('Internal Server Error', { status: 500 });
		}
	},
};
