const Information = require("../models/information");
var osu = require('node-os-utils')
var cpu = osu.cpu;
var mem = osu.mem;
const si = require('systeminformation');
const sysInfoDBService = require("../services/sysInfoDbService");

//get the system data 
async function sysInformations() {

    let curDate;
    let cpUsage;
    let memoryUsage;
    let networkUsage;
    try {
        // console.log(await si.processes());  
        curDate = new Date();
        cpUsage = await cpu.usage();
        memoryUsage = await mem.info();
        //console.log(memoryUsage.usedMemMb)
        networkUsage = await si.networkStats();
    } catch (error) {
        console.log(error);
    }
    let curSysInfo = new Information(curDate, cpUsage, memoryUsage, networkUsage);
    return curSysInfo;
}
let currentInformation = {};

// get the current informations 
async function CurrentInformation() {
    console.log("Collection information");
    currentInformation = await sysInformations();
    //SaveToDatabase
    sysInfoDBService.saveInfo(currentInformation);
    setTimeout(await CurrentInformation, 10000);
}

CurrentInformation();

function currentInfo() {
    return currentInformation;
}


module.exports.sysInformations = sysInformations;
module.exports.currentInfo = currentInfo;
