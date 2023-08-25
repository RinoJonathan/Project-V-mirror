const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.engine('ejs', ejsMate);
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));



const port =  3000;

app.get("/", (req, res) => {

    res.render("pages/homepage");
})




app.get("*", (req, res) => {

    res.send("Route not found");
})

app.listen(port, () => {
    console.log(`listening from port: ${port} `)
})