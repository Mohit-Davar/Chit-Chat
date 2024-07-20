const chat = require("../model/chatModel.js");

const sortContacts = async (userId, req, res) => {
    try {
        const result = await chat.aggregate([
            // Match chats where the user is a participant
            { $match: { participants: userId } },

            // Project to exclude the user from participants
            {
                $project: {
                    participants: {
                        $filter: {
                            input: "$participants",
                            as: "participant",
                            cond: { $ne: ["$$participant", userId] }
                        }
                    },
                    messages: 1
                }
            },

            // Unwind the participants array
            { $unwind: "$participants" },

            // Lookup to join the messages collection
            {
                $lookup: {
                    from: "messages",
                    let: { participantId: "$participants", userId: userId },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $and: [{ $eq: ["$sender", "$$userId"] }, { $eq: ["$receiver", "$$participantId"] }] },
                                        { $and: [{ $eq: ["$sender", "$$participantId"] }, { $eq: ["$receiver", "$$userId"] }] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "recentMessage"
                }
            },

            // Add a default recent message if there are none
            {
                $addFields: {
                    recentMessage: {
                        $ifNull: [{ $arrayElemAt: ["$recentMessage", 0] }, { createdAt: new Date(0) }]
                    }
                }
            },

            // Lookup to join the User collection for contact details
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "contactDetails"
                }
            },

            // Unwind the contactDetails array
            { $unwind: "$contactDetails" },

            // Lookup to include message details
            {
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "messageDetails"
                }
            },

            // Sort the contacts by the timestamp of the most recent message
            { $sort: { "recentMessage.createdAt": -1 } }
        ])
        return result;
    } catch (err) {
        req.flash("error", "Cannot fetch contacts right now")
        return res.redirect("/user/login")
    }
};

module.exports = {
    sortContacts
};
