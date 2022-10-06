var data = require("./data-service");
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


app.listen(HTTP_PORT, onHttpStart);