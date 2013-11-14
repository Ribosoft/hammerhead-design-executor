var scheduler = require('./lib/scheduler/'),
    queryer = require('./lib/queryer/'),
    async = require('async'),
    mailer = require('./lib/mailer/');

var intervalTimeout = 15 * 1000 * 60;

var app = {};

app.launchPendingRequests = function(callback){
    async.waterfall([
	queryer.getCountPendingRequests,
	executeNext(queryer.getNextRequest),
	scheduler.startProcessingRequest
    ], function(err, requestId, timeoutInterval){
	if(err)
	    callback(new Error("Error "+err+" while launching pending requests."));
	else if(!requestId) 
	    callback(null, "No pending requests exist");
	else {
	    callback(null, "Request "+requestId+" launched");
	}
    });
}

app.notifyFinishedRequests = function(callback){
    async.waterfall([
	queryer.getCountFinishedRequests,
	executeNext(queryer.getFinishedRequests),
	mailer.notifyOwners
    ], function(err, numberNotified){
	if(err)
	    callback(new Error("Errors "+err+" while notifying owners" ), 0);
	else
	    callback(null, numberNotified);
    });
}

var executeNext = function(next){
     return function(count, callback){
	if(count > 0)
	    next(callback);
	else{
	    callback(null, '');
	}
    }
}

var executeScript = function(){
    async.waterfall(
	[
	    queryer.getCountRunningRequests,
	    function(callback, count) {
		if(count <= 0)
		    callback(null);
		else
		    callback(new Error("There is still one request running"));
	    },
	    app.launchPendingRequests,
	    function(result, callback){
		console.log( result );
		callback(null);
	    },
	    app.notifyFinishedRequests,
	    function(count, callback){
		if(count)
		    console.log( "Successfully Notified "+count+" requests"  );
		else
		    console.log( "No requests to be notified" );
		callback(null);
	    }
	],
	function(err){
	    if(err)
		console.log( "Process failed because of "+err );
	    console.log( "Executor finished . Rescheduling in "+(intervalTimeout/(60 * 1000))+" minutes");
	    setTimeout(executeScript, intervalTimeout);
	});
};


if (module !== require.main) {
    module.exports = exports = app;
} else {
    executeScript();
}
