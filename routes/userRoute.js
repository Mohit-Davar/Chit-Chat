const express = require("express")
const router = express.Router()

router.route("/signup")
    .get((req, res) => { res.render("signup") })
    .post((req, res) => {

    })
router.route("/login")
    .get((req, res) => { res.render("login") })
    .post((req, res) => {

    })
module.exports = router