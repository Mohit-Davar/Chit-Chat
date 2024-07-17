// importing user model
const user = require("../model/userModel.js")
const { JWTGeneration } = require("../service/userAuthentication.js")
const fs = require('fs');
const path = require('path');
// function to handle User Signup
async function handleUserSignUp(req, res) {
    const options = {
        httpOnly: true,
        sameSite: 'None', secure: true,
    }
    const body = req.body
    try {
        if (body.remember) {
            options.maxAge = 24 * 60 * 60 * 1000 * 40
        }
        const result = await user.create({
            name: {
                firstName: body.first_Name,
                lastName: body.last_Name,
            },
            email: body.email,
            password: body.password,

        })
        const payload = {
            email: result.email,
            id: result._id,
            img: result.profile.profileImg
        }
        const token = JWTGeneration(payload)
        res.cookie("token", token, options)
        return res.status(201).redirect("/chat")
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            req.flash('error', 'Email Already Exists')
            return res.redirect(`/user/signup`)
        }
        console.log(error)
        req.flash('error', 'Internal Server Error , cannot Signup right now')
        return res.redirect(`/user/signup`)
    }
}
// function to handle user Signin
async function handleUserSignIn(req, res) {
    const body = req.body
    const options = {
        httpOnly: true,
        sameSite: 'None', secure: true,
    }
    try {
        const candidate = await user.findOne({
            email: body.email,
        })
        if (!candidate) {
            req.flash('error', 'Wrong Email')
            return res.redirect(`/user/login`)
        }
        const isMatch = await candidate.comparePassword(body.password)
        if (!isMatch) {
            req.flash('error', 'Wrong Password')
            return res.redirect(`/user/login`)
        }
        if (body.remember) {
            options.maxAge = 24 * 60 * 60 * 1000 * 40
        }
        const payload = {
            email: candidate.email,
            id: candidate._id,
            img: candidate.profile.profileImg
        }
        const token = JWTGeneration(payload)
        res.cookie("token", token, options)
        return res.redirect(`/chat`)
    } catch (err) {
        req.flash('error', 'Internal server error, cannot login right now')
        return res.redirect(`/user/login`)
    }
}
//function to handle edit
async function handleProfileEdit(req, res) {
    const { email } = req.userData; // Assuming req.userData contains logged-in user's email
    const body = req.body;

    try {
        // Find the logged-in user by email
        const loggedInUser = await user.findOne({ email });

        // Prepare update fields
        const updateFields = {
            profile: {
                status: loggedInUser.profile.status,
                profileImg: loggedInUser.profile.profileImg
            }
        };

        // Update profileImg if there's a file upload
        if (req.file) {
            const filePath = path.resolve(__dirname, `../public/${loggedInUser.profile.profileImg}`);
            updateFields.profile.profileImg = `/uploads/${req.file.filename}`;
            
            if(!loggedInUser.profile.profileImg == "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZI3WfV6fNLFMTOZ4BZZkaPXWYsqQygwzqaA&s"){
                fs.unlink(filePath, (err) => {
                    if (err) {
                        req.flash("error", "Internal server error, cannot change photo now")
                        return res.redirect("/chat/myprofile")
                    }
                });
            }

        }
        // Update status if it's provided in the request body
        if (body.status) {
            updateFields.profile.status = body.status;
        }
        // Update the user's profile
        await user.updateOne({ email }, updateFields);
        return res.redirect("/chat");
    } catch (err) {
        req.flash("error", "Internal server error, cannot edit right now.")
        return res.redirect("/chat");
    }
}
module.exports = {
    handleUserSignUp,
    handleUserSignIn,
    handleProfileEdit
}