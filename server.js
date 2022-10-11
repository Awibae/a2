/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Alexander Banigan Student ID: 151167202 Date: 2022-10-11
*
* Your app’s URL (from Cyclic) : https://zany-top-coat-elk.cyclic.app
*
*************************************************************************/ 
var dataservice = require('./data-service.js');
var express = require("express");
var app = express();
app.use(express.static('public'));
var path = require("path");

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
        console.log(error);
    });
})
app.get("/managers", function(req, res) {
    dataservice.getManagers().then(function(managers) {
        res.json(managers);
    }).catch(function(error) {
        console.log(error);
    });
})
app.get("/departments", function(req, res) {
    dataservice.getDepartments().then(function(departments) {
        res.json(departments);
    }).catch(function(error) {
        console.log(error);
    });
})
app.use((req, res)=> {
    res.status(404).send("Page not found");
})

dataservice.initialize().then(function() {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(error) {
    console.log(error);
})

