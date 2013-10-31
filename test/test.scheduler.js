var algorithm = require('hammerhead-design'),
    should = require('should'),
    async = require('async'),
    fs = require('fs'),
    app = require('../index.js'),
    mongoose = require('mongoose'),
    test_data = require('./test_data.js'),
    test_utils = require('./test_utils.js');

var RequestExecutor = algorithm.HandleRequest;
var AlgoRequest = algorithm.Model.DomainObjects.Request;

var Request = mongoose.model('Request');

var testID = 'Test';
var pathToDir = process.cwd()+'/'+testID;

beforeEach(function(done){
    test_utils.rmDirIfExists(pathToDir);
    done();
});

describe('Scheduling pending requests', function(){
    before(function(done){
	test_utils.emptyDb(done);
    });
	
    it('No Request scheduled if none exists', function(done){
	app.launchPendingRequests(function(err, resultId){
	    if(err){
		err.toString().should.include("No pending requests exist");
		done();
	    } else {
		done(new Error("PendingRequests did not return error"));
	    }
	});
    });

    it('Designed request should be launched', function(done){
	var requestData = test_data.longSequence.request;
	async.waterfall(
	    [
		function(callback){
		    callback(null, testID, requestData);
		},
		utils.createPendingRequest,
		function(id, callback){
		    app.launchPendingRequests(callback);
		}
	    ],
	    function(err, resultId){
		if(err){
		    done(err);
		}
		else {
		    resultId.should.eql(testID);
		    done();
		} 
	    });
    });
});

// Always keep last
after(function(done){
    test_utils.rmDirIfExists(pathToDir);
    done();
});