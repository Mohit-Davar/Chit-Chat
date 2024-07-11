// importing user model
const user = require("../model/userModel.js")
const { JWTGeneration } = require("../service/userAuthentication.js")
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
            id: result._id
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
        req.flash('error', 'Internal Server Error')
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
            id: candidate._id
        }
        const token = JWTGeneration(payload)
        res.cookie("token", token, options)
        return res.redirect(`/chat`)
    } catch (err) {
        req.flash('error', 'Internal Server Error')
        return res.redirect(`/user/login`)
    }
}
module.exports = {
    handleUserSignUp,
    handleUserSignIn,
}