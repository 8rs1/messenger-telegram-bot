import { sendMessage, forwardMessage } from '../api/telegram.js';
import { ADMIN_ID, BOT_COMMANDS } from '../constants.js';
export const handleStartCommand = async (token, message) => {
	const text = `Hi ${message.from.first_name}, welcome to messenger bot.\nYou can use this bot for contacting with admin.`;
	await sendMessage(token, message.chat.id, text);
};
export const handleInvalidMessage = async (token, message) => {
	await sendMessage(token, message.chat.id, 'Invalid message!\nPlease use commands.');
};
export const handleUserMessageToAdmin = async (token, message) => {
	if (message.text.toLowerCase() === BOT_COMMANDS.CANCEL) {
		await handleInvalidMessage(token, message);
		return;
	}
	// Forward user message to admin
	await forwardMessage(token, message.chat.id, ADMIN_ID, message.message_id);
	// Create inline keyboard for answer
	const replyOpts = {
		inline_keyboard: [
			[
				{
					text: 'answer',
					callback_data: `admin_reply.${message.chat.id}-${message.message_id}`,
				},
			],
		],
	};
	// Send answer key to admin
	await sendMessage(token, ADMIN_ID, 'For answer to user, click below button.', {
		reply_markup: replyOpts,
	});

	// User confirm
	await sendMessage(token, message.from.id, 'Your message sent✅', {
		reply_parameters: {
			message_id: message.message_id,
		},
	});
};
