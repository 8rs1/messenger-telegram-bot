import { answerCallbackQuery, sendMessage } from '../api/telegram.js';
import { activateAnswerState } from '../utils/state.js';

export const handleCallbackQuery = async (token, update) => {
	const { data, id: callbackQueryId } = update.callback_query;

	if (data.startsWith('admin_reply.')) {
		const userData = data.split('.')[1];
		const [userChatId, userMsgId] = userData.split('-');
		// Active answer state
		activateAnswerState(userChatId, userMsgId);
		// Answer to callback query
		await answerCallbackQuery(token, callbackQueryId, 'Answer state is activated!');
		// Send message to admin for answer
		await sendMessage(token, update.callback_query.message.chat.id, 'Type answer', {
			reply_markup: {
				force_reply: true,
				input_field_placeholder: 'Type your answer...',
				selective: true,
			},
		});
		return true;
	}
	return true;
};
