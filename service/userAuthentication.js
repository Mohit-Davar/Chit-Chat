const jwt = require("jsonwebtoken")
const JWTGeneration = (userData)=>{
    return jwt.sign(userData, "Hello")
}
module.exports = {
    JWTGeneration
}