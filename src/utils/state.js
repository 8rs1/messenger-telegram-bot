let answerState = {
	flag: false,
	user: {
		id: null,
		msgId: null,
	},
};

export const getAnswerState = () => ({ ...answerState });

export const activateAnswerState = (userId, msgId) => {
	answerState = {
		flag: true,
		user: { id: userId, msgId: msgId },
	};
	return getAnswerState();
};

export const resetAnswerState = (userId, msgId) => {
	answerState = {
		flag: false,
		user: { id: null, msgId: null },
	};
	return getAnswerState();
};

export const isAnswerStateActive = () => answerState.flag;
