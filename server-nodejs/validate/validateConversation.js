const Conversation = require('../models/conversation');
const User = require('../models/user');

const validateConversation = {
    validateSimpleConversation: async (userId1, userId2) => {
        const conversationId = await Conversation.existsSimpleConversation(
            userId1,
            userId2
        );
        console.log(conversationId);
        if (conversationId) return { conversationId };

        const user1 = await User.findById(userId1);
        const user2 = await User.findById(userId2);

        return {
            name1: user1.name,
            name2: user2.name,
        };
    },
};

module.exports = validateConversation;
