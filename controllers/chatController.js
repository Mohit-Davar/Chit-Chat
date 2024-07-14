const user = require("../model/userModel.js")
const displayChat = async (req, res) => {
    const email = req.params.id
    try {
        const searchedUser = await user.findOne({
            email: email
        })
        if (!searchedUser) {
            req.flash('error', 'No Such User Exist')
            return res.redirect("/chat")
        }
        return res.render("chat", {
            user: searchedUser
        })
    } catch (err) {
        req.flash('error', 'Internal User Error')
        return res.redirect("/chat")
    }
}
module.exports={
    displayChat
}