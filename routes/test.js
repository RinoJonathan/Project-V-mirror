const express = require('express')
const router = express.Router();


router.get('/' , (req, res) => {

    res.send("test route")
})

router.get('/1' , (req, res) => {

    res.send("test route 1")
})

module.exports =  router