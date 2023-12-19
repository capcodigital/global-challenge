var config = require('./config');
var mongoose = require("mongoose");

var bootStatus = require("./status");
var fs = require("fs");
// Bootstrap db connection
// var db = exports.db = mongoose.connect(config.db.toString(), bootStatus.dependency());

var db = exports.db = mongoose.connect(config.db.toString())
.then(() => bootStatus.dependency())
.catch((err) => { console.error(err); });

mongoose.connection.on("connected", function(ref){
    console.log("Database Connection Connected");
});

mongoose.connection.on("open", function(ref){
    console.log("Database Connection Open");
});

mongoose.connection.on("disconnected", function(ref){
    console.log("Database Connection Disconnected");
    console.log("End Process");
    process.exit(1);
});

mongoose.connection.on("error", function(err){
    console.log("Database Connection Failure");
    console.log(err);
    console.log("End Process");
    process.exit(1);
});

mongoose.connection.on("close", function(err){
    console.log("Database Connection Closed");
    console.log("End Process");
    process.exit(1);
});

// Bootstrap models
var models_path = __dirname + '/../models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);
