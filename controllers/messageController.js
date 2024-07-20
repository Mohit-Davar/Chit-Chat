const message = require("../model/messageModel.js");
const chat = require("../model/chatModel.js");

const addMessage = async (sentBy, sendTo, msg, type = "text") => {
    try {
        const genMessage = await message.create({
            sender: sentBy,
            receiver: sendTo,
            content: msg,
            type: type
        });
        return genMessage._id;
    } catch (error) {
        console.error("Error adding message:", error);
        throw error;
    }
};

const updateChat = async (sentBy, sendTo, id) => {
    try {
        let gotConversation = await chat.findOneAndUpdate(
            { participants: { $all: [sentBy, sendTo] } },
            { $push: { messages: id } },

        );

        if (!gotConversation) {
            gotConversation = await chat.create({
                participants: [sentBy, sendTo],
                messages: [id]
            });
        }

        return gotConversation;
    } catch (error) {
        console.error("Error updating chat:", error);
        throw error;
    }
};

module.exports = {
    addMessage,
    updateChat
};
