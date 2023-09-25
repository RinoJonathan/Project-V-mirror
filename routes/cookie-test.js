const express = require('express')

const router  = express.Router();



router.get('/setCookie', (req, res) => {

    res.cookie('name', 'rino1')
    res.send("got some cookie")
})

router.get('/getCookie', (req, res) =>{

    console.log(req.cookies)
    res.send("cookies:")
})

router.get('/greet', (req, res) => {

    const {name = "anon"} = req.cookies
    res.send(`Hello There ${name}`)
})


//arcane art of signing cookies: give secret in cookie parser middleware

router.get('/setSignedCookie', (req, res) => {

    res.cookie('password', 'v for vendetta', {signed: true})

    res.send("Here is your signed cookie")
})

router.get('/getSignedCookie', (req, res) => {

    res.send(req.signedCookies)
})


//exporting code

module.exports = router 