const express = require("express")
const router = express.Router()
const { displayChat, displayContact, addContact, displayHome } = require('../controllers/chatController')

router.get("/", displayHome)
router.get("/profile", displayContact)
router.post("/profile/:id", addContact)
router.get("/messages/:id", displayChat)
module.exports = router