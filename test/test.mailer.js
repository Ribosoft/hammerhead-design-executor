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

describe('Notifying finished requests', function(){
    this.timeout(5 * 1000); //times out at 5 seconds
    before(function(done){
	test_utils.emptyDb(done);
    });
	
    it('No notification if no request finished', function(done){
	app.notifyFinishedRequests(function(err, count){
	    if(err){
		done(err);
	    } else {
		count.should.eql(0);
		done();
	    }
	});
    });

    it('Finished request causes notification to be sent', function(done){
	var requestData = test_data.longSequence.request;
	var resultsData = test_data.longSequence.results;
	async.waterfall(
	    [
		function(callback){
		    callback(null, testID, requestData);
		},
		test_utils.createRequest,
		test_utils.saveRequest,
		function(request, callback){
		    callback(null, request, resultsData);
		},
		test_utils.setRequestFinished,
		function(request, callback){
		    app.notifyFinishedRequests(callback);
		}
	    ],
	    function(err, count){
		if(err){
		    done(err);
		}
		else {
		    count.should.eql(1);
		    done();
		} 
	    });
    });
});


describe('Notifying blocked requests', function(){
    this.timeout(5 * 1000); //times out at 5 seconds
    before(function(done){
	test_utils.emptyDb(done);
    });
/*	
    it('No notification if no request is blocked', function(done){
	app.handleRunningRequests(function(err, result){
	    if(err){
		err.message.should.include("No running request");
		done();
	    } else {
		done("handleRunningRequests found some running request");
	    }
	});
    });
*/

    it('Blocked request causes notification to be sent', function(done){
	var requestData = test_data.longSequence.request;
	var resultsData = test_data.longSequence.results;
	async.waterfall(
	    [
		function(callback){
		    callback(null, testID, requestData);
		},
		test_utils.createRequest,
		test_utils.saveRequest,
		function(request, callback){
		    callback(null, request, resultsData);
		},
		test_utils.setRequestBlocked,
		function(request, callback){
		    app.handleRunningRequests(callback);
		}
	    ],
	    function(err, result){
		if(err){
		    done(err);
		}
		else {
		    result.should.include("Notified owner of blocked process");
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
