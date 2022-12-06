/*
mongodb+srv://AlexDB:<password>@senecaweb.oozwx6e.mongodb.net/?retryWrites=true&w=majority
*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
let User; // to be defined on new connection (see below)
var userSchema = new Schema({
    "userName"      : {type: String, unique: true},
    "password"      : String,
    "email"         : String,
    "loginHistory"  : [{
        "dateTime"  : Date,
        "userAgent" : String
    }]
});
const bcrypt = require('bcryptjs');

module.exports.initialize = () => {
    return new Promise(function(resolve, reject) {
        var db1 = mongoose.createConnection("mongodb+srv://AlexDB:Alexander1028@senecaweb.oozwx6e.mongodb.net/bti325_a6", {useNewUrlParser: true, useUnifiedTopology: true});
        db1.on('error', (err)=>{
            console.log("Error connecting to Atlas: " + err);
            reject(err);
        });
        db1.once('open', ()=>{
            console.log("Connected to Atlas successfully!");
            User = db1.model("users", userSchema);
            resolve();
        });
    })
}

module.exports.registerUser = (userData) => {
    return new Promise(function(resolve, reject) {
        if (userData.password.trim() == "" || userData.password2.trim() == "") { // maybe str.length == 0
            reject("Error: Password cannot be empty or only white spaces");
        }
        else if (userData.password != userData.password2) {
            reject("Error: Passwords do not match");
        }
        else {
            bcrypt.hash(userData.password, 10).then(function(hashish) {
                userData.password = hashish;
                let newUser = new User(userData);
                newUser.save(function(err){
                    if (err) {
                        if (err.code == 11000) {
                            reject("User Name already taken");
                        }
                        else {
                            reject("There was an error creating the user: " + err);
                        }
                    }
                    else {
                        resolve();
                    }
                });
            }).catch(function(err) {
                reject("There was an error encrypting the password");
            })
        }
    })
}

module.exports.checkUser = (userData) => {
    return new Promise(function(resolve, reject) {
        User.findOne({userName: userData.userName}).exec().then(function(foundUser) {
            if (foundUser == null) {
                reject("Unable to find user: " + userData.userName);
            }
            else {
                bcrypt.compare(userData.password, foundUser.password).then(function(result){
                    if (result == true) {
                        foundUser.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                        User.updateOne({userName: userData.userName}, {$set: {loginHistory: foundUser.loginHistory}}).exec().then(function(){
                            resolve(foundUser);
                        }).catch(function(err){
                            reject("There was an error verifying the user: " + err);
                        })
                    }
                    else {
                        reject("Password is not correct for userName: " + userData.userName);
                    }
                })
                
            }
        }).catch(function(){
            reject("Unable to find user: " + userData.userName);
        })
    })
}
