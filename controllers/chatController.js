const user = require("../model/userModel.js")

const displayChat = async (req, res) => {
    const email = req.params.id
    if (email === req.userData.email){
        req.flash("error","You cannot message yourself")
        return res.redirect("/chat")
    }

        try {
            const searchedUser = await user.findOne({
                email: email
            })
            if (!searchedUser) {
                req.flash('error', 'No Such User Exist')
                return res.redirect("/chat")
            }
            return res.render("chat", {
                user: searchedUser,
                profile: await user.findOne({ email: req.userData.email }).populate("contacts")
            })
        } catch (err) {
            req.flash('error', 'Internal server error, cannot display chat right now')
            return res.redirect("/chat")
        }
}
const displayContact = async (req, res) => {
    query = req.query.name
    if (!query) return res.redirect("/chat")
    try {
        allUsers = await user.find({ $text: { $search: `${query}` } })
        if (!allUsers) {
            req.flash("error", "No such user exist")
            return res.redirect("/chat")
        }
        return res.render("contacts", {
            users: allUsers
        })
    } catch (err) {
        req.flash("error", "Internal server error, cannot display profiles right now")
        return res.redirect("/chat")
    }
}
const addContact = async (req, res) => {
    const id = req.params.id;
    if (id === req.userData.id) {
        req.flash("error", "You cannot add yourself as a contact");
        return res.redirect("/chat");
    };
    try {
        await user.findOneAndUpdate(
            {
                email: req.userData.email
            },
            {
                $addToSet: {
                    contacts: id
                }
            }
        );
        return res.redirect("/chat");
    } catch (err) {
        req.flash("error", "An error occurred while adding the contact");
        return res.redirect("/chat");
    }
}
const displayHome = async (req, res) => {
    const email = req.userData.email
    try {
        const loggedInUser = await user.findOne({ email: email }).populate("contacts")
        return res.render("home", {
            user: loggedInUser,
            profileImg: loggedInUser.profile.profileImg
        })
    } catch (err) {
        req.flash("error", "Cannot connect to server right now")
        return res.redirect("/user/login")
    }
}
module.exports = {
    displayChat,
    displayContact,
    addContact,
    displayHome
}