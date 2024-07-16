const express = require("express")
const router = express.Router()
const { handleUserSignIn, handleUserSignUp  } = require("../controllers/userController")

router.route("/signup")
    .get((req, res) => { res.render("signup") })
    .post(handleUserSignUp)
router.route("/login")
    .get((req, res) => { res.render("login") })
    .post(handleUserSignIn)
module.exports = router