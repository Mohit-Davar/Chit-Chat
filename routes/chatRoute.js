const express = require("express")
const router = express.Router()
const { displayChat } = require('../controllers/chatController')
router.get("/", (req, res) => res.render("home"))

router.get("/profile", (req, res) => {
    
})
router.get("/messages/:id", displayChat)
module.exports = router