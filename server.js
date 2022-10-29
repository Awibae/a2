/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
* No part of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Alexander Banigan Student ID: 151167202 Date: 2022-10-29
*
* Your app’s URL (from Cyclic) : https://zany-top-coat-elk.cyclic.app
*
*************************************************************************/ 
var dataservice = require('./data-service.js');
var express = require("express");
var app = express();
app.use(express.static('public'));
var path = require("path");
var multer = require("multer");
var fs = require('fs');

var images = [];

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage : storage});

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
})

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
})

app.get("/employees", function(req, res) {
    dataservice.getAllEmployees().then(function(employees) {
        res.json(employees);
    }).catch(function(error) {
        res.json(error);
    });
})
app.get("/employees/add", function(req, res) {

})

app.get("/managers", function(req, res) {
    dataservice.getManagers().then(function(managers) {
        res.json(managers);
    }).catch(function(error) {
        res.json(error);
    });
})

app.get("/departments", function(req, res) {
    dataservice.getDepartments().then(function(departments) {
        res.json(departments);
    }).catch(function(error) {
        res.json(error);
    });
})


app.get("/images/add", function(req, res) {

})
app.post("/images/add", upload.single("imageFile", (req, res) => {
    res.send("/images");
}))
app.get("/images", function(req, res) {
    fs.readdir("./public/images/uploaded", function(err, items) {
        if (err) {
            reject("Failure to read file file");
        }
        else {
            images = JSON.parse(items);
        }
    })
})

app.use((req, res)=> {
    res.status(404).send("Page not found");
})

dataservice.initialize().then(function() {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(error) {
    res.json(error);
})

