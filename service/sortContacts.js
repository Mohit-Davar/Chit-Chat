const chat = require("../model/chatModel.js");

const sortContacts = async (userId) => {
    try {
        const result = await chat.aggregate([
            // Match chats where the user is a participant
            { $match: { participants: userId } },

            // Unwind the messages array
            { $unwind: "$messages" },

            // Lookup to join the messages collection
            {
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "messageDetails"
                }
            },

            // Unwind the messageDetails array
            { $unwind: "$messageDetails" },

            // Sort messages by timestamp in descending order
            { $sort: { "messageDetails.createdAt": -1 } },

            // Group by the contact (sender or receiver) to get the most recent message
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$messageDetails.sender", userId] },
                            "$messageDetails.receiver",
                            "$messageDetails.sender"
                        ]
                    },
                    mostRecentMessage: { $first: "$messageDetails" }
                }
            },

            // Lookup to join the User collection
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactDetails"
                }
            },

            // Unwind the contactDetails array
            { $unwind: "$contactDetails" },

            // Sort the contacts by the timestamp of the most recent message
            { $sort: { "mostRecentMessage.createdAt": -1 } }
        ]);

        return result;
    } catch (err) {
        req.flash("error", "Cannot fetch contacts right now")
        return res.redirect("/user/login")
    }
};

module.exports = {
    sortContacts
};
