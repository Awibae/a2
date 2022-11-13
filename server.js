/*************************************************************************
* BTI325– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Alexander Banigan Student ID: 151167202 Date: 2022-11-13
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application: 
* https://nameless-stream-85589.herokuapp.com/
*
*************************************************************************/ 
var dataservice = require('./data-service.js');
var express = require("express");
var app = express();
app.use(express.static('public'));
var path = require("path");
var multer = require("multer");
var fs = require('fs');
var exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


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
    res.render('home');
})

app.get("/about", function(req, res){
    res.render('about');
})

app.get("/employees", function(req, res) {
    if (req.query.status) {
        dataservice.getEmployeesByStatus(req.query["status"]).then(function(statusEmployee) {
            res.render("employees", {employees: statusEmployee});
        }).catch(function(error) {
            res.render("employees",{message: error});
        })
    }
    else if (req.query.department) {
        dataservice.getEmployeesByDepartment(req.query["department"]).then(function(departmentEmployee) {
            res.render("employees", {employees: departmentEmployee});
        }).catch(function(error) {
            res.render("employees",{message: error});
        })
    }
    else if (req.query.manager) {
        dataservice.getEmployeesByManager(req.query["manager"]).then(function(managerEmployee) {
            res.render("employees", {employees: managerEmployee});
        }).catch(function(error) {
            res.render("employees",{message: error});
        })
    }
    else {
        dataservice.getAllEmployees().then(function(employees) {
            res.render("employees", {employees: employees});
        }).catch(function(error) {
            res.render("employees",{message: error});
        });
    }
})
app.get("/employees/add", function(req, res) {
    res.render('addEmployee');
})
app.post("/employees/add", function(req, res) {
    dataservice.addEmployee(req.body).then(function() {
        res.redirect("/employees");
    });
})
app.get("/employee/:value", function(req, res) {
    dataservice.getEmployeeByNum(req.params.value).then(function(employee) {
        res.render("employee", { employee: employee});
    }).catch(function(error) {
        res.render("employee",{message: error});
    })
})
app.post("/employee/update", (req, res) => {
    console.log(req.body);
    dataservice.updateEmployee(req.body).then(function() {
        res.redirect("/employees");
    }).catch(function(error) {
        res.json(error);
    })
   
});

app.get("/departments", function(req, res) {
    dataservice.getDepartments().then(function(departments) {
        res.render("departments", {departments: departments});
    }).catch(function(error) {
        res.render("departments",{message: error});
    });
})

app.get("/images/add", function(req, res) {
    res.render('addImage');
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
            imagesArray.images = JSON.stringify(items);
            res.render("images", {imagesList: items});
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

