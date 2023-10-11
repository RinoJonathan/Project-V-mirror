const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {

    res.send("info")
})

router.get('/about',  (req, res) => {

    // res.render("features/trim")
    res.render('pages/about')
})

router.get('/offline', (req, res) => {

    res.render('pages/offline')
})


module.exports = router