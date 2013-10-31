var scheduler = require('./lib/scheduler/'),
    queryer = require('./lib/queryer/'),
    async = require('async'),
    mailer = require('./lib/mailer/');

var timeoutPendingRequets = 0;
var timeoutNotifications = 0;

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
	    callback(new Error("No pending requests exist"));
	else
	    callback(null, requestId);
    });
}

app.notifyFinishedRequests = function(){
    async.waterfall([
	queryer.getCountFinishedRequests,
	executeNext(queryer.getFinishedRequests),
	mailer.notifyOwners
    ], function(err, request){
	if(err)
	    console.log( "Errors "+err+" while notifying owners" );
	else
	    console.log( "Successfully notified all owners" );
    });
}

var executeNext = function(next){
     return function(count, callback){
	if(count > 0)
	    queryer.getNextRequest(callback);
	else{
	    callback(null, '');
	}
    }
}

var executeScript = function(){
    app.launchPendingRequests();    
};


if (module !== require.main) {
    module.exports = exports = app;
} else {
    executeScript();
}
