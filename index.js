// require('events').EventEmitter.prototype._maxListeners = 25;

const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const appError = require("./utilities/appError")
const asyncWrapper = require("./utilities/asyncWrapper")

const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportLocal = require('passport-local')
var GoogleStrategy = require('passport-google-oauth20').Strategy;


app.use((req, res, next) => {
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    next();
  });
  

mongoose.connect("mongodb://localhost:27017/projectV")
    .then(() => {
        console.log("Mongoose Connected successfully")
    })
    .catch( (e)=> {
        console.log(e)
    })

const User = require('./models/user')


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.use(cookieParser(process.env['COOKIE_PARSER_SECRET']))

const sessionConfig ={
    secret: process.env['SESSION_SECRET'],
    resave: false,
    saveUninitialized: false,
    cookie: {

        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig))


app.engine('ejs', ejsMate);
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")))
app.use(flash())




app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: "http://localhost:3000/user/google/callback"
    // scope: ['profile', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    User.findOrCreate({ googleId: profile.id },
        {
        email: profile.emails[0].value,
        username: profile.displayName // Get the first email from the profile
        // Other fields you want to store
    }, 
    function (err, user) {
      return cb(err, user);
    });
  }
));





passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//middlewares

const flashMiddleware = (req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.failure = req.flash('failure')
    res.locals.error = req.flash('error')
    
    
    next()
}

app.use(flashMiddleware)

//routes
const testRoutes = require('./routes/test')
const cookieRoute = require('./routes/cookie-test')
const sessionRoute = require('./routes/session')

const userRoute = require('./routes/user')
const featureRoute = require('./routes/features')
const infoRoute = require('./routes/info')

app.use('/test', testRoutes)
app.use('/cookie', cookieRoute)
app.use('/session', sessionRoute)

app.use('/user', userRoute)
app.use('/feature', featureRoute)
app.use('/info', infoRoute)

const port =  3000;

app.get("/", (req, res) => {

    console.log(req.user)
    
    res.render("pages/homepage");
})



app.get('/fakeUser', (req, res) => {

    const fakeUser = new User({email:"sandy@gmail.com", username: "sandy"})
    const rUser = User.register(fakeUser, "randompass")
    res.send(rUser)
    
})



//404 route

app.all("*", (req, res) => {
    throw new appError("page not found", 404)
})

//error handling route

app.use((err, req, res, next) => {
    
    const { message= "something went wrong", status= 500, stack } = err

    console.log(`Error: ${status}  ${message}`)
    res.status(status).render("error", { status, message, stack})
})



app.listen(port, () => {
    console.log(`listening from port: ${port} `)
})