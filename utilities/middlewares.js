const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Retrieve the secret key from an environment variable

const isLoggedIn = (req, res, next) => {
  // Check if the user is authenticated via Passport
  if (req.isAuthenticated()) {
    // User is authenticated via Passport, proceed to the next middleware
    return next();
  }

  // Check if there's a JWT token in the cookies
  if (req.cookies && req.cookies.jwt) {
    req.flash('success', 'Your session expired, please login again.');
    return res.redirect('/user/login');
  }

  // If neither Passport authentication nor JWT token authentication is found, redirect to login
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'You must be signed in first!');
  return res.redirect('/user/login');
};

module.exports = { isLoggedIn };

