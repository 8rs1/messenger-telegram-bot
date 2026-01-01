export default async function sendMessage(token, chatId, text, opts = {}) {
	try {
		const keyboard = {
			inline_keyboard: [[{ text: 'answer', callback_data: 'admin_reply' }]],
		};
		const res = await sendRequest(token, 'sendMessage', {
			chat_id: chatId,
			text,
			reply_markup: keyboard,
			...opts,
		});
		return res;
	} catch (err) {
		throw err;
	}
}
// export default sendMessage();
