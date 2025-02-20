const path = require("path")
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads/"))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now().toLocaleString("en-IN")}-${file.originalname}`
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })
module.exports = upload