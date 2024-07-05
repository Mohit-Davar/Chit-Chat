require('dotenv').config()
const JWTSecretKey = process.env.JWTSecretKey;

const jwt = require("jsonwebtoken")
const JWTMiddleware = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).redirect(`/user/login`)
    }
    try {
        
        const decodedPayload = jwt.verify(token, JWTSecretKey)
        req.userData = decodedPayload
        next()
    } catch (err) {
        req.flash('error', 'Internal Server Error: Signup or Login Again')
        return res.redirect(`/user/login`)
    }
}
module.exports = {
    JWTMiddleware
}