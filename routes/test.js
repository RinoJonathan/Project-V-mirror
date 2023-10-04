const express = require('express')
const router = express.Router();


router.get('/' , (req, res) => {

    res.send("test route")
})

router.get('/1' , (req, res) => {

    req.flash('success', 'hurray')
    res.send("test route 1")
})

router.get('/flash', (req, res) => {

    req.flash('success', 'hurray')
    res.redirect('/')
})

router.get('/flashf', (req, res) => {

    req.flash('failure', 'oopsie')
    res.redirect('/')
})

module.exports =  router