import axios from 'axios';

// Base telegram functions
export const sendTelegramRequest = async (token, method, data) => {
	const url = `https://api.telegram.org/bot${token}/${method}`;
	try {
		const response = await axios.post(url, data);
		return response;
	} catch (err) {
		console.error(`Telegram API error (${method}):`, err.response?.data || err.message);
		throw err;
	}
};
export const sendMessage = async (token, chatId, text, opts = {}) => {
	return sendTelegramRequest(token, 'sendMessage', {
		chat_id: chatId,
		text,
		...opts,
	});
};
export const forwardMessage = (token, fromChatId, toChatId, messageId) => {
	return sendTelegramRequest(token, 'forwardMessage', {
		from_chat_id: fromChatId,
		chat_id: toChatId,
		message_id: messageId,
	});
};
export const editMessageText = (token, chatId, messageId, text) => {
	return sendTelegramRequest(token, 'editMessageText', {
		chat_id: chatId,
		message_id: messageId,
		text,
	});
};
export const answerCallbackQuery = (token, callbackQueryId, text) => {
	return sendTelegramRequest(token, 'answerCallbackQuery', {
		callback_query_id: callbackQueryId,
		text,
	});
};
