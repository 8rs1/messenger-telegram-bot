/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// const sendMessage = require('./components/sendmessage.js');
const ADMIN_ID = 6073299107;
const axios = require('axios');
let answerState = {
	flag: false,
	user: { id: null, msgId: null },
};
export default {
	async fetch(request, env, ctx) {
		const update = await request.json();
		if (request.method === 'POST' && update.message && answerState.flag) {
			await sendMessage(env.BOT_TOKEN, answerState.user.id, update.message.text, {
				reply_parameters: {
					message_id: answerState.user.msgId,
				},
			});
			answerState = {
				flag: false,
				user: { id: null, msgId: null },
			};
		} else if (request.method === 'POST' && update.message) {
			await sendMessageToAdmin(env.BOT_TOKEN, update.message.chat.id, update.message.message_id);
			return new Response('Hello World!');
		} else if (request.method === 'POST' && update.callback_query) {
			const { data } = update.callback_query;
			switch (true) {
				case data.startsWith('admin_reply.'):
					const userData = data.split('.')[1];
					const [userChatId, userMsgId] = userData.split('-');
					answerState.flag = true;
					answerState.user.id = userChatId;
					answerState.user.msgId = userMsgId;
					await sendMessage(env.BOT_TOKEN, update.callback_query.from.id, 'Type answer', {
						reply_markup: {
							force_reply: true,
							input_field_placeholder: 'Type your answer...',
							selective: true,
						},
					});

					break;
			}
		}
		return new Response('logic test');
	},
};
async function sendRequest(token, method, data) {
	const url = `https://api.telegram.org/bot${token}/${method}`;
	try {
		const response = await axios.post(url, data);
		return response;
	} catch (err) {
		return err;
	}
}

async function sendMessage(token, chatId, text, opts = {}) {
	try {
		const res = await sendRequest(token, 'sendMessage', {
			chat_id: chatId,
			text,
			...opts,
		});
		return res;
	} catch (err) {
		throw err;
	}
}

async function forwardMessage(token, from, to, msgId) {
	try {
		const res = await sendRequest(token, 'forwardMessage', {
			from_chat_id: from,
			chat_id: to,
			message_id: msgId,
		});
		return res;
	} catch (err) {
		throw err;
	}
}

async function sendMessageToAdmin(token, chatId, msgId) {
	try {
		const replyOpts = {
			inline_keyboard: [[{ text: 'answer', callback_data: `admin_reply.${chatId}-${msgId}` }]],
			force_reply: true,
			input_field_placeholder: 'Type your answer...',
			selective: true,
		};
		const res = await forwardMessage(token, chatId, ADMIN_ID, msgId);
		const sendRes = await sendMessage(token, ADMIN_ID, 'Choose one of bottom keys', {
			reply_markup: replyOpts,
		});
		return res + sendRes;
	} catch (err) {
		throw err;
	}
}
async function editMessage(token, chatId, msgId, text) {
	try {
		const res = await sendRequest(token, 'editMessageText', {
			chat_id: chatId,
			message_id: msgId,
			text,
		});
		return res;
	} catch (err) {
		throw err;
	}
}
