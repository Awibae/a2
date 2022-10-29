var employees = []
var departments = [];

var fs = require('fs');

module.exports.initialize = () => {
    return new Promise(function(resolve, reject) {
        let file1 = () => {
            return new Promise(function(resolve, reject) { 
            fs.readFile('./data/employees.json', (err,data) => {
            if (err) {
                reject("Failure to read file employees.json");
            }
            else {
                employees = JSON.parse(data);
                resolve();
            }
            })
        })
    }
        file1().then(function() {
        fs.readFile('./data/departments.json',(err,data) => {
            if (err) {
                reject("Failure to read file employees.json!");
            }
            else {
                departments = JSON.parse(data);
                resolve();
            }
        })
        })
    })
}
module.exports.getAllEmployees = () => {
    return new Promise(function(resolve, reject) {
        if (employees.length <= 0) {
            reject("No results returned")
        }
        else {
            resolve(employees);
        }
    })
}
module.exports.getManagers = () => {
    return new Promise(function(resolve, reject) {
        var managers = [];
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                managers[i] = employees[i];
            }
        }
        if (managers.length <= 0) {
            reject("No results returned");
        }
        else {
            resolve(managers);
        }
    })
}
module.exports.getDepartments = () => {
    return new Promise(function(resolve, reject) {
        if (departments.length <= 0) {
            reject("No results returned");
        }
        else {
            resolve(departments);
        }
    })
}