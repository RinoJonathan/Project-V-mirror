const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../utilities/middlewares')

router.get('/', (req, res) => {

    res.send("features")
})

router.get('/trim', isLoggedIn, (req, res) => {

    res.render("features/trim")
})

router.get('/convert', isLoggedIn, (req, res) => {

    res.render("features/convert")
})

router.get('/merge', isLoggedIn, (req, res) => {

    res.render("features/merge")
})

router.get('/split', isLoggedIn, (req, res) => {

    res.render("features/split")
})

router.get('/resize', isLoggedIn, (req, res) => {

    res.render("features/resize")
})

router.get('/getaudio', isLoggedIn, (req, res) => {

    res.render("features/getaudio")
})

router.get('/muteaudio', isLoggedIn, (req, res) => {

    res.render("features/muteaudio")
})

module.exports = router