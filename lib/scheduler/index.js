var algorithm = require('hammerhead-design');
var fs = require('fs'),
    rimraf = require('rimraf'),
    path = require('path');

var Executor = algorithm.HandleRequest;
var AlgoRequest = algorithm.Model.DomainObjects.Request;

exports = module.exports = scheduler = {};

scheduler.startProcessingRequest = function(req, callback){
    if(!req){
	callback(null, '');
    } else {
	var env = req.getEnv();
	var specificity = req.specificity == "hybrid"? true : false;
	var preferences = {
	    'tempEnv' : req.tempEnv,
	    'naEnv' : req.naEnv,
	    'mgEnv' : req.mgEnv,
	    'oligoEnv' : req.oligoEnv,
	    'cutsites' : req.cutsites,
	    'left_arm_min' : req.left_arm_min,
	    'right_arm_min' : req.right_arm_min,
	    'right_arm_max' : req.right_arm_max,
	    'left_arm_max' : req.left_arm_max,
	    'targetRegion' : req.targetRegion,
	    'specificity' : specificity
	};
	if(req.promoter)
	    preferences.promoter = 'TAATACGACTCACTATAGGG';
	var algoRequest = new AlgoRequest(
	    req.sequence,
	    req.accessionNumber,
	    preferences,
	    req.uuid,
	    (req.foldShape == "Wishbone") ? 1 : 0,
	    env.target,
	    function(request){
		req.state = request.State;
		if(request.ErrorContainer.length > 0) {
		    console.log( "ErrorContainer had errors" );
		    req.state += request.ErrorContainer.join("\n");
		} else if(request.Completed) {
		    console.log( "Request completed successfully" );
		    req.status = 4;
		}
		req.save(function(err, res){
		    if(err)
			console.log( "Error "+err+" while updating status of request" );
		});
		cleanUp(request.ID);
	    });

	try{
	    var remaining = Executor.HandleRequestPart1(algoRequest);
	    req.status = 3;
	    req.remainingDuration = Math.ceil(remaining);
	    req.save(function(err, res){
		if(err) callback(err);
		else
		    callback(null, res.uuid, remaining);
	    });
	} catch(err) {
	    callback(err);
	}

    }
};


function cleanUp(requestId){
    //Delete all folders, except json files
    var pathToDirs = path.join(process.cwd(), requestId);
    fs.readdir(pathToDirs, function(err, files){
	if(!err){
	    files.forEach(function(file){
		var pathToDir = path.join(pathToDirs, file);
		if(fs.statSync(pathToDir).isDirectory()){
		    rimraf(pathToDir,function(){});
		}
	    });
	}
    });
}
