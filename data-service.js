var employees = []
var departments = [];

const e = require('express');
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
module.exports.addEmployee = (employeeData) => {
    return new Promise(function(resolve, reject) {
        if (employeeData.isManager == undefined) {
            employeeData.isManager = false;
        }
        else {
            employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length + 1;
        employees[employees.length + 1] = employeeData;
        resolve();
    })
}
module.exports.getEmployeesByStatus = (status) => {
    return new Promise(function(resolve, reject) {
        var statusEmployee = [];
        for (var i = 0, j = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                statusEmployee[j] = employees[i];
                j++;
            }
        }
        if (statusEmployee.length <= 0) {
            reject("No results returned");
        }
        else {
            resolve(statusEmployee);
        }
    })
}
module.exports.getEmployeesByDepartment = (department) => {
    return new Promise(function(resolve, reject) {
        var departmentEmployee = [];
        for (var i = 0, j = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                departmentEmployee[j] = employees[i];
                j++;
            }
        }
        if (departmentEmployee.length <= 0) {
            reject("No results returned");
        }
        else {
            resolve(departmentEmployee);
        }
    })
}
module.exports.getEmployeesByManager = (manager) => {
    return new Promise(function(resolve, reject) {
        var managerEmployee = [];
        for (var i = 0, j = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) {
                managerEmployee[j] = employees[i];
                j++;
            }
        }
        if (managerEmployee.length <= 0) {
            reject("No results returned");
        }
        else {
            resolve(managerEmployee);
        }
    })
}
module.exports.getEmployeeByNum = (num) => {
    return new Promise(function(resolve, reject) {
        var numEmployee = employees[0];
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                numEmployee = employees[i];
                resolve(numEmployee);
            }
        }
        if (numEmployee == undefined) {
            reject("No employee found with this number");
        }
    })
}
module.exports.updateEmployee = (employeeData) => {
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == employeeData.employeeNum) {
                employees[i] = employeeData;
                resolve();
                var uhoh = false;
            }
            else {
                var uhoh = true; // designates an error/no employee with that number
            }
        }
        if (uhoh == true) {
            reject("No employee found with this number");
        }
    })
}