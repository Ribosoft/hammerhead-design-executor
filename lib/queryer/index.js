var config = require('../../config/config.json'),
    mongoose = require('mongoose'),
    request = require('request.js');


if(process.env.NODE_ENV == 'test') {
    mongoose.connect( config.db.ribosoftTestDbUrl );
} else {
    mongoose.connect( config.db.ribosoftDbUrl );
}

var Request = mongoose.model('Request');

