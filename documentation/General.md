This is a general documentation describing about ProjectV. This Rant is meant to give a brief intro into the technologies used in our project


# Problem
Before we get into the technologies, i find it important to address the problem we solve. Most online video editors require the user  to upload their video files online. This rises a concern for privacy and the bandwidth used is high (since, we have to both upload and download the video)
Our project is an attempt to bring the convenience of online video editors and self contained video model of app based video editors

# FFMPEG.wasm

this is the core technology used to implement the video editing functionality. FFMPEG is originally a command line video editing tool based off c programming language. 
wasm stands for web assembly - an intermediary language which can help programs based on various system languages on the browser.
ffmpeg.wasm is the web assembly transpilation of ffmpeg. So, this enables us to perform video manupulation from the client browser

# Ejs

This is the frontend / templating language used for the ui. This is nothing but  good old html, css, js combined with  features to enable dynamic rendering of web pages.

# Nodejs

The server we use for the project is written using nodejs language. and the server framework we use is expressjs. the server combined with mongodb database helps in performing backend activities like storing user details. In future, this can be extended to have more functionality

#  Mongodb
Mongodb is the database we use . it is a flexible db with some perks of its own. We use Atlas to host mongodb for production 

# PWA
PWA stands for progressive web app. Since our project does its processing from the client side, we added PWA functionalities to stress upon the fact that it brings best of both worlds. The caching feature that pwas have prevents the user from downloading the payload for ffmpeg.wasm again and again

This gives  our app the capability to be installed / saved to the homescreen and make it function like an app

our current caching strategy enables users to access the features which have been visited before to be accessed without  internet the second time

our app is currently hosted in render platform  here is the link: 
https://projectv-5z6y.onrender.com/
