var config = require('../../config/config.json'),
    mongoose = require('mongoose'),
    request = require('../../models/request.js');

if(process.env.NODE_ENV == 'test') {
    mongoose.connect( config.db.ribosoftTestDbUrl );
} else {
    mongoose.connect( config.db.ribosoftDbUrl );
}

var Request = mongoose.model('Request');

exports = module.exports = queryer = {};

queryer.getCountPendingRequests = function(callback){
    getCountQueriedRequests({status: 2}, callback);
}

queryer.getCountFinishedRequests = function(callback){
    getCountQueriedRequests({status: 4}, callback);
}

queryer.getNextRequest = function(callback){
    Request.find({status: 2}).sort({createDate: 'asc'}).exec(function(err, requests){
	if(err)
	    callback(err);
	else
	    callback(null, requests[0]);
    });
};

queryer.getFinishedRequests = function(callback){
    Request.find({status: 4}).sort({createDate: 'asc'}).exec(function(err, requests){
	if(err)
	    callback(err);
	else
	    callback(null, requests);
    });
}

function getCountQueriedRequests(query, callback){
    Request.count(query), function(err, count){
	if(err)
	    callback(err);
	else
	    callback(null, count);
    });
}
