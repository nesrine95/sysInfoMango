var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1:27017/systemInformations';
const infoModel = require("../models/InformationModel");
const logModel = require("../models/logModel");
const sysInfoService = require("../services/sysInfoService");

//connect to DB
function connectionDB() {
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;
    db.on
        ('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once
        ("open", function () {
            console.log("Connected successfully");
        });
}

// Save data in DB
function saveInfo(sysInfo) {
    //console.log("I am saving data");
    const info = new infoModel(sysInfo)
    info.save();
}

// clear DB from data old than 10 days 
function clearDataBase() {
    var today = new Date();
    var tenDaysAgo = today.setDate(today.getDate() - 10);
    infoModel.deleteMany({ "time": { $lte: tenDaysAgo } }, function (err) {
        if (err) console.log(err);
        //console.log("Successful deletion");
    });
}

//clear the database every 2 seconds
setInterval(clearDataBase, 2000);

//get the informations of a specific period 
async function informationsByPeriod(startDate, endDate) {

    let result = await infoModel.find({ $and: [{ "time": { $lte: endDate } }, { "time": { $gte: startDate } }] });
    return result;
    //let result = await infoModel.find({ "time": { $gte: startDate,lte: endDate } });
}

//add log informations to db 
function saveLog(reqBody) {
   
    let sysInfo = sysInfoService.currentInfo();
    const log = new logModel({
        datetime:reqBody.datetime,
        appName:reqBody.appName,
        logLevel:reqBody.logLevel,
        logString:reqBody.logString,
        sysInfo:sysInfo,
    })
    log.save();
}

//get the logs of a specific period 
async function logsByPeriod(startDate, endDate) {

    let result = await logModel.find({ $and: [{ "datetime": { $lte: endDate } }, { "datetime": { $gte: startDate } }] });
    return result;

}

//get the logs by date ,appName ,logLevel ,keyword
async function logsByFilters(startDate, endDate, logLevel, appName, keyword) {

    let dateTimeSearchObject = { "datetime": { $gte: startDate, $lte: endDate } };
    let appNameSearchObject = { "appName": appName };
    let logStringSearchObject = { "logString": { $regex: new RegExp(keyword, 'i') } };
    let logLevelSearchObject = { "logLevel": logLevel };
    let findCriteria = [];

    //if (typeof startDate !== "undefined" && startDate != null && typeof endDate !== "undefined" && endDate != null)
    findCriteria.push(dateTimeSearchObject);
    if (appName)
        findCriteria.push(appNameSearchObject);
    if (keyword)
        findCriteria.push(logStringSearchObject);
    if (logLevel)
        findCriteria.push(logLevelSearchObject);
    console.log(findCriteria);
    let logInfo = await logModel.find({
        $and: findCriteria
    });
    return logInfo;
}
//get all the app names existing in DB
async function allAppNames (){
    let result = await logModel.find().distinct( "appName");
    return result;
} 

module.exports.connectionDB = connectionDB;
module.exports.saveInfo = saveInfo;
module.exports.informationsByPeriod = informationsByPeriod;
module.exports.saveLog = saveLog;
module.exports.logsByPeriod = logsByPeriod;
module.exports.logsByFilters = logsByFilters;
module.exports.allAppNames = allAppNames;