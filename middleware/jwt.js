const jwt = require("jsonwebtoken")
require('dotenv').config()

const JWTMiddleware = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).redirect(`/user/login`)
    }
    try {
        const payload = jwt.verify(token, process.env.JWTSecretKey)
        req.userData = payload
        next()
    } catch (err) {
        req.flash('error', 'Internal Server Error: Signup or Login Again')
        return res.redirect(`/user/login`)
    }
}

module.exports = {
    JWTMiddleware
}