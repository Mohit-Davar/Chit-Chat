const mongoose = require('mongoose')
async function connectToMongoDB(url) {
    return mongoose.connect(url).then(() => console.log("MongoDB is Connected")).catch(err => console.error(err))
}
module.exports = {
    connectToMongoDB
}