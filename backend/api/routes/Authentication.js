const express = require("express")
const router = express.Router()
const passport = require("passport")

router.get("/login", passport.authenticate('google', {scope: ['email', 'profile']}));

router.get("/login/redirect", passport.authenticate('google', {failureRedirect: '/login/failure', successRedirect: '/login/success'}))

router.get("/login/success", async (request, response) => response.status(200).send(request.body))

router.get("/login/failure", async (request, response) => response.status(401).send(request.body))

router.get("/logout", async (request, response) => {
    request.session = null
    request.logout()
    request.redirect('/')
})

module.exports = router