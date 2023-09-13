const express = require("express")
const router = express.Router()
const Controller = require('../../domain/Account/Controller')
const Authentication = require('../middlewares/authentication')

router.get("/account", Authentication, async (request, response) => {
    const result = await Controller.account(request)
    response.status(result.status).send(result.body)
})

module.exports = router