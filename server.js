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
const { application } = require('express');
const e = require('express');

const imagesArray = {images: ""};

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage : storage});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
    if (req.query.status) {
        dataservice.getEmployeesByStatus(req.query["status"]).then(function(statusEmployee) {
            res.json(statusEmployee);
        }).catch(function(error) {
            res.json(error);
        })
    }
    else if (req.query.department) {
        dataservice.getEmployeesByDepartment(req.query["department"]).then(function(departmentEmployee) {
            res.json(departmentEmployee);
        }).catch(function(error) {
            res.json(error);
        })
    }
    else if (req.query.manager) {
        dataservice.getEmployeesByManager(req.query["manager"]).then(function(managerEmployee) {
            res.json(managerEmployee);
        }).catch(function(error) {
            res.json(error);
        })
    }
    else {
        dataservice.getAllEmployees().then(function(employees) {
            res.json(employees);
        }).catch(function(error) {
            res.json(error);
        });
    }
})
app.get("/employees/add", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"))
})
app.post("/employees/add", function(req, res) {
    dataservice.addEmployee(req.body).then(function() {
        res.redirect("/employees");
    });
})
app.get("/employee/:value", function(req, res) {
    dataservice.getEmployeeByNum(req.params.value).then(function(employee) {
        res.json(employee);
    }).catch(function(error) {
        res.json(error);
    })
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
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
})
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
})
app.get("/images", function(req, res) {
    fs.readdir("./public/images/uploaded", function(err, items) {
        if (err) {
            reject("Failure to read file");
        }
        else {
            imagesArray.images = JSON.parse(JSON.stringify(items));
        }
    })
    res.json(imagesArray);
})

app.use((req, res)=> {
    res.status(404).send("Page not found");
})

dataservice.initialize().then(function() {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(error) {
    res.json(error);
})

