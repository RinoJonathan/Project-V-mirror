const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require("../models/user")

const catchAsync= require('../utilities/asyncWrapper')
const {isLoggedIn} = require('../utilities/middlewares')


router.get('/register', (req, res) => {

    res.render('pages/register')
})

router.post('/register', catchAsync(async (req, res) => {

    try{

        // Check if the user is already authenticated with Google
    if (req.isAuthenticated() && req.user.googleId) {
        // Handle the case where the user is already authenticated with Google
        req.flash('error', 'You are already registered with Google.');
        return res.redirect('/');
    }

    const {email, username, password} = req.body
    const newUser = new User({email, username})
    const registeredUser = await User.register(newUser, password)
    console.log("registered user: " + registeredUser)
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Account Successfully Created")
    res.redirect('/')
    })  
    }
    catch(e) {
        req.flash("error", e.message)
        res.redirect('/')
    }
}))

router.get('/login', (req, res) => {

    res.render('pages/login')
})


router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/user/login'}) ,(req, res) => {

    req.flash("success", `Logged in successfully as ${req.user.username} `)

    // console.log(req.user)
    if(req.session.returnTo){
    const redirectUrl = req.session.returnTo ;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    }
    else{
        res.redirect('/')
    }

})


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.flash('success', 'Logged in with Google successfully');
    res.redirect('/');
  });


router.get('/logout', (req, res) => {

    req.logout( (err) => {

        if(err) req.flash('error', err.message) 
    })
        req.flash('success', "Goodbye!");
        res.redirect('/');
});



router.get('/', isLoggedIn, (req, res) => {

    res.send('user')
})




module.exports = router