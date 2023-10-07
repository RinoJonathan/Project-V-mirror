const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../utilities/middlewares')

router.get('/', (req, res) => {

    res.send("features")
})

router.get('/trim', isLoggedIn, (req, res) => {

    res.render("features/trim")
})

module.exports = router