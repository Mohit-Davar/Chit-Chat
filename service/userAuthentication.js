const jwt = require("jsonwebtoken")
require('dotenv').config()
const JWTGeneration = (userData)=>{
    return jwt.sign(userData, process.env.JWTSecretKey)
}
module.exports = {
    JWTGeneration
}