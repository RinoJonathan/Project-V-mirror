const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require("../models/user")
require('dotenv').config();

const catchAsync= require('../utilities/asyncWrapper')
const {isLoggedIn} = require('../utilities/middlewares')

//JWT settings - vestigial feature
// JWT is rudimentarily used in our app, /feature  caching strategy made this happen
const jwt = require('jsonwebtoken');
const tokenExpirationDays = 21; 

const setJwtCookies = (expiryDays, req, res) => {

  const tokenExpiration = tokenExpirationDays * 24 * 60 * 60 ;
  const maxAgeMilliseconds = tokenExpirationDays * 24 * 60 * 60 * 1000;
  const userData = { userId: req.user._id, username: req.user.username, email: req.user.email }
  const token = jwt.sign(userData, process.env['JWT_SECRET'], { expiresIn: tokenExpiration });
       
  if (!token) {
    req.flash("error", "Failed to generate JWT token.");
    return res.redirect('/');
  }

  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAgeMilliseconds }); // Store the token in a cookie (secure and HTTP-only for securi

}

const setNameCookie = (req, res) => {

  res.cookie("UserName", req.user, { maxAge: tokenExpirationDays*24*60*60 , httpOnly: false })

}


router.get('/register', (req, res) => {

    res.render('pages/register')
})

router.post('/register', catchAsync(async (req, res) => {

    try{

        // Check if the user is already authenticated with Google
    if (req.isAuthenticated() && req.user.googleId) {
        // Handle the case where the user is already authenticated with Google
        req.flash('error', 'You are already logged in with Google.');
        return res.redirect('/');
    }

    const {email, username, password} = req.body
    const newUser = new User({email, username})
    const registeredUser = await User.register(newUser, password)
    console.log("registered user: " + registeredUser)
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        

        try{
        
        setJwtCookies(tokenExpirationDays, req, res)
        setNameCookie(req, res)
        
        req.flash("success", "Account Successfully Created")
        res.redirect('/')
        }
        catch(e) {
            
            req.flash("error", "Account cant stay logged in offline")
            console.log("error during jwt tokenization")
            
        }
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


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), (req, res) => {
    try {
      // Ensure that the JWT_SECRET environment variable is set
      if (!process.env.JWT_SECRET) {
        req.flash("error", "Server error: JWT secret key missing.");
        return res.redirect('/');
      }
  

      setJwtCookies(tokenExpirationDays, req, res)
      setNameCookie(req, res)

      req.flash("success", `Logged in successfully as ${req.user.username}`);
      
      if (req.session.returnTo) {
        const redirectUrl = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(redirectUrl);
      } else {
        res.redirect('/');
      }
    } catch (e) {
      req.flash("error", "Account can't stay logged in offline");
      console.error("Error during JWT tokenization:", e);
      console.log(e.message)
      res.redirect('/');
    }
  });
  


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    try {
      // Ensure that the JWT_SECRET environment variable is set
      if (!process.env.JWT_SECRET) {
        req.flash("error", "Server error: JWT secret key missing.");
        return res.redirect('/');
      }
  
      setJwtCookies(tokenExpirationDays, req, res)
      setNameCookie(req, res)
  
      req.flash("success", `Logged in successfully as ${req.user.username}`);
      res.redirect('/');
    } catch (e) {
      req.flash("error", "Account can't stay logged in offline");
      console.error("Error during JWT tokenization:", e);
      res.redirect('/');
    }
  });
  


router.get('/logout', (req, res) => {

    req.logout( (err) => {

        if(err) req.flash('error', err.message) 
    })
        res.clearCookie('UserName')
        req.flash('success', "Goodbye!");
        res.redirect('/');
});



router.get('/', isLoggedIn, (req, res) => {

    console.log(req.user.email)
    res.send('user')
})




module.exports = router