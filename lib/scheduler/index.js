var algorithm = require('hammerhead-design');

var Executor = algorithm.HandleRequest;
var AlgoRequest = algorithm.Model.DomainObjects.Request;

exports = module.exports = scheduler = {};

scheduler.startProcessingRequest = function(req, callback){
    var algoRequest = new AlgoRequest(
	req.sequence,
	req.accessionNumber,
	{
	    'tempEnv' : req.tempEnv,
	    'naEnv' : req.naEnv,
	    'mgEnv' : req.mgEnv,
	    'oligoEnv' : req.oligoEnv,
	    'cutsites' : req.cutsites,
	    'left_arm_min' : req.left_arm_min,
	    'right_arm_min' : req.right_arm_min,
	    'right_arm_max' : req.right_arm_max,
	    'left_arm_max' : req.left_arm_max
	},
	req.uuid,
	0,
	'blah',
	function(request){
	    req.state = request.State;
	    if(request.Completed)
		req.status = 4;
	    req.save(function(err, res){
		console.log( "Error "+err+" while setting the request to processed" );
	    });
	});

    try{
	var remaining = Executor.HandleRequestPart1(AlgoRequest);
	req.status = 3;
	req.remainingDuration = remaining;
	req.save(function(err, res){
	    if(err) callback(err);
	    else
		callback(null, res.uuid, remaining);
	});
    }catch(err){
	callback(err);
    }
}
