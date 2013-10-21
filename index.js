var scheduler = require('./lib/scheduler/'),
    queryer = require('./lib/queryer/'),
    mailer = require('./lib/mailer/');

if( queryer.areRequestsPending() ){
    scheduler.startProcessingRequest(queryer.getNextRequest())
}

if( queryer.areRequestsFinished() ){
    mailer.notifyOwners(queryer.getFinishedRequestsContact())
}
