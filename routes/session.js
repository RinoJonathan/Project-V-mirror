const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {

    res.send("session")
})

router.get('/count', (req, res) => {

    if(req.session.count){
        req.session.count += 1
    }
    else{
        req.session.count =1
    }

    res.send(`you viewed the page ${req.session.count} times`)
})

module.exports = router