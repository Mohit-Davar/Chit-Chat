const express = require("express")
const router = express.Router()
const { displayChat, displayContact, addContact } = require('../controllers/chatController')

router.get("/", (req, res) => res.render("home"))
router.get("/profile", displayContact)
router.post("/profile/:id", addContact)
router.get("/messages/:id", displayChat)
module.exports = router