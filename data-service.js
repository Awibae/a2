var employees = []
var departments = [];

const e = require('express');
var fs = require('fs');
const { builtinModules } = require('module');
const { resolve } = require('path');
const Sequelize = require('sequelize');
var sequelize = new Sequelize('ztrcubfn', 'ztrcubfn', 'rOvBGIdYfctJ6-Jqdiy6tYttCvTqMe0S', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    firstName: {type: Sequelize.STRING},
    lastName: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING},
    SSN: {type: Sequelize.STRING},
    addressStreet: {type: Sequelize.STRING},
    addressCity: {type: Sequelize.STRING},
    addressState: {type: Sequelize.STRING},
    addressPostal: {type: Sequelize.STRING},
    maritalStatus: {type: Sequelize.STRING},
    isManager: {type: Sequelize.BOOLEAN},
    employeeManagerNum: {type: Sequelize.INTEGER},
    status: {type: Sequelize.STRING},
    department: {type: Sequelize.INTEGER},
    hireDate: {type: Sequelize.STRING}
})
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    departmentName: {type: Sequelize.STRING}
})

module.exports.initialize = () => {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(function() {
            resolve()
        }).catch(function(){
            reject("unable to sync the database");
        })
    })
}
//Employee functions start
module.exports.getAllEmployees = () => {
    return new Promise(function(resolve, reject) {
        Employee.findAll().then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no result returned");
        })
    })
}
module.exports.getEmployeesByStatus = (status) => {
    return new Promise(function(resolve, reject) {
    Employee.findAll({where: {status: status}}).then(function(data){
        resolve(data);
    }).catch(function(){
        reject("no results returned");
    })
    })
}
module.exports.getEmployeesByDepartment = (department) => {
    return new Promise(function(resolve, reject) {
    Employee.findAll({where: {department: department}}).then(function(data){
        resolve(data);
    }).catch(function(){
        reject("no results returned");
    })
    })
}
module.exports.getEmployeesByManager = (manager) => {
    return new Promise(function(resolve, reject) {
    Employee.findAll({where: {employeeManagerNum: manager}}).then(function(data){
        resolve(data);
    }).catch(function(){
        reject("no results returned");
    })
    })
}
module.exports.getEmployeeByNum = (num) => {
    return new Promise(function(resolve, reject) {
    Employee.findAll({where: {employeeNum: num}}).then(function(data){
        resolve(data[0]);
    }).catch(function(){
        reject("no results returned");
    })
    })
}
module.exports.addEmployee = (employeeData) => {
    return new Promise(function(resolve, reject) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (var prop in employeeData) {
        if (employeeData[prop] == ""){
            employeeData[prop] = null;
        }
    }
    Employee.create(employeeData).then(function(){
        resolve();
    }).catch(function(){
        reject("unable to create employee");
    });
    })
}
module.exports.updateEmployee = (employeeData) => {
    return new Promise(function(resolve, reject) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (var prop in employeeData) {
        if (employeeData[prop] == ""){
            employeeData[prop]= null;
        }
    }
    Employee.update(employeeData, {where: {employeeNum: employeeData.employeeNum}}).then(function(){ // where shit
        resolve();
    }).catch(function(){
        reject("unable to update employee");
    })
    })
}
module.exports.deleteEmployeeByNum = (empNum) => {
    return new Promise(function(resolve, reject) {
        Employee.destroy({where: {employeeNum: empNum}}).then(function(){
            resolve();
        }).catch(function(){
            reject("unable to find or delete employee by that employee number");
        })
    })
}

//Employee functions end
//Department functions start
module.exports.getDepartments = () => {
    return new Promise(function(resolve, reject) {
        Department.findAll().then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no result returned");
        })
    })
}
module.exports.addDepartment = (departmentData) => {
    return new Promise(function(resolve, reject) {
        for (var prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.create(departmentData).then(function(){
            resolve();
        }).catch(function(){
            reject("unable to create department");
        })
    })
}
module.exports.updateDepartment = (departmentData) => {
    return new Promise(function(resolve, reject) {
        for (var prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.update(departmentData, {where: {departmentId: departmentData.departmentId}}).then(function(){
            resolve();
        }).catch(function(){
            reject("unable to update department");
        })
    })
}
module.exports.getDepartmentById = (id) => {
    return new Promise(function(resolve, reject) {
        Department.findAll({where: {departmentId: id}}).then(function(data){
            resolve(data[0]);
        }).catch(function(){
            reject("no result returned");
        })
    })
}
//Department functions end