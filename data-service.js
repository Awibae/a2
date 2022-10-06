var employees = []
var departments = [];

var fs = require('fs');
const { resolve } = require('path');

function initialize() {
    var readSuccess = false;
    return new Promise(function(resolve, reject) {
        fs.readFile('./data/employees.json', (err,data) => {
            if (err) {
                readSuccess = false;
                reject("Failure to read file employees.json");
            }
            else {
                readSuccess = true;
                employees = json.parse(data);
            }
        })
        fs.readFile('./data/departments.json',(err,data) => {
            if (err) {
                readSuccess = false;
                reject("Failure to read file employees.json!");
            }
            else {
                readSuccess = true;
                employees = JSON.parse(data);
            }
        })
        if (readSuccess == true) {
            resolve(employees.toString());
        }
    })
    
}