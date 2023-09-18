const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const appError = require("./utilities/appError")
const asyncWrapper = require("./utilities/asyncWrapper")

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.engine('ejs', ejsMate);
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));




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

    console.log(`${status}  ${message}`)
    res.status(status).render("error", { status, message, stack})
})



app.listen(port, () => {
    console.log(`listening from port: ${port} `)
})