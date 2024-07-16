const express = require("express")
const router = express.Router()
const { displayChat, displayContact, addContact, displayHome } = require('../controllers/chatController')
const {handleProfileEdit} = require('../controllers/userController.js')
const upload = require("../service/multer.js")

router.get("/", displayHome)
router.get("/profile", displayContact)
router.post("/profile/:id", addContact)
router.get("/messages/:id", displayChat)

router.route("/myprofile")
    .get((req, res) => res.render("editProfile"))
    .post(upload.single("file-upload"), handleProfileEdit)
module.exports = router