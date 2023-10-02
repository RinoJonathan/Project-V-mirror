const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const appError = require("./utilities/appError")
const asyncWrapper = require("./utilities/asyncWrapper")

const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')


mongoose.connect("mongodb://localhost:27017/projectV")
    .then(() => {
        console.log("Mongoose Connected successfully")
    })
    .catch( (e)=> {
        console.log(e)
    })



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const secret = "projectV"  //must be placed in .env during production
app.use(cookieParser(secret))

const sessionConfig ={
    secret: secret,
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



//middlewares

const flashMiddleware = (req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.failure = req.flash('failure')
    
    next()
}

app.use(flashMiddleware)

//routes
const testRoutes = require('./routes/test')
const cookieRoute = require('./routes/cookie-test')
const sessionRoute = require('./routes/session')

app.use('/test', testRoutes)
app.use('/cookie', cookieRoute)
app.use('/session', sessionRoute)

const port =  3000;

app.get("/", (req, res) => {
    
    res.render("pages/homepage");
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