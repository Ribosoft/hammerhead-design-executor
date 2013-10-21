var fs = require('fs'),
    async = require('async');


exports = module.exports = utils = {};

utils.rmDirIfExists = function(pathToDir){
    if(fs.existsSync(pathToDir)){
        fs.rmdirSync(pathToDir);        
    }
};
