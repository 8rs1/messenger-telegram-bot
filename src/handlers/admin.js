import { sendMessage } from '../api/telegram.js';
import { resetAnswerState, getAnswerState } from '../utils/state.js';
import { BOT_COMMANDS } from '../constants.js';

export const handleAdminReply = async (token, message) => {
	if (message.text === BOT_COMMANDS.CANCEL) {
		resetAnswerState();
		await sendMessage(token, message.chat.id, 'Operation cancelled', {
			reply_parameters: {
				message_id: message.message_id,
			},
		});
		return true;
	}
	const state = getAnswerState();
	// Send admin answer to user
	await sendMessage(token, state.user.id, message.text, {
		reply_parameters: {
			message_id: state.user.msgId,
		},
	});

	// Close answer state
	resetAnswerState();

	// Confirm to admin
	await sendMessage(token, message.chat.id, 'Your message sent to user', {
		reply_parameters: {
			message_id: message.message_id,
		},
	});
	return true;
};
