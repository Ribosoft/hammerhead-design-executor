var nodemailer = require('nodemailer'),
    async = require('async');

module.exports = exports = mailer = {};

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
	user: "ribosoft.mailer@gmail.com",
        pass: "ribosoft"
    }
});

if(process.env.NODE_ENV == 'test') {
    var host = "http://localhost/ribosoft/";
} else {
    var host = "http://drkharma.com/ribosoft/";
}

mailer.notifyOwnerRequestFailed = function(request, callback){
    if(!request)
	callback(null, "No owner to notify");
    else {
	var sendMail = function(request, callback){
	    var receiver = request.emailUser;
	    var subject = "Result from Ribosoft for request "+request.uuid;
	    var message = "Hello,<br/><p>Your request seems to have failed. Please retry at the address "+host+".<br/><br/>Regards,<br/>The Ribosoft Team</p>";

	    var mailOptions = {
		from: "Ribosoft <ribosoft.mailer@gmail.com>", 
		to: receiver, 
		subject: subject,
		html: message
	    };

	    smtpTransport.sendMail(mailOptions, function(err){
		if(err){
		    callback(err);
		}
		else {
		    request.setStatus(5);
		    request.save(function(err, req){
			if(err) callback(err);
			else
			    callback(null);
		    });
		}
	    });
	};

	sendMail(request, function(err){
	    smtpTransport.close();
	    if(err)
		callback(err);
	    else
		callback(null, "Notified owner of blocked process successfully");

	});
    }    
};


mailer.notifyOwners = function(requests, callback){
    var errorArray = [];
    var count = requests.length;

    if(count <= 0)
	callback(null, count);
    else {
	var sendMail = function(request, callback){
	    var receiver = request.emailUser;
	    var link = host + 'results/'+request.uuid;
	    var subject = "Result from Ribosoft for request "+request.uuid;
	    var message = "Hello,<br/><p>Your request has now been completed. You can view the results at the address :<a href='"+link+"' />"+link+"</a>.<br/><br/>Regards,<br/>The Ribosoft Team</p>";

	    var mailOptions = {
		from: "Ribosoft <ribosoft.mailer@gmail.com>", 
		to: receiver, 
		subject: subject,
		html: message
	    };

	    smtpTransport.sendMail(mailOptions, function(err){
		if(err){
		    callback(err);
		}
		else {
		    request.setStatus(5);
		    request.save(function(err, req){
			if(err) callback(err);
			else
			    callback(null);
		    });
		}
	    });
	};
	
	async.eachSeries(requests, sendMail, function(err){
	    smtpTransport.close();
	    if(err)
		callback(err);
	    else
		callback(null, count);

	});
    }
};
