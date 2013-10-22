var nodemailer = require('nodemailer');

module.exports = exports = mailer = {};

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {

    }
});

if(process.env.NODE_ENV == 'test') {
    var host = "http://localhost/ribosoft/";
} else {
    var host = "http://drkharma.com/ribosoft/";
}

mailer.notifyOwners = function(requests, callback){
    var errorArray = [];
    requests.forEach(function(request, index){
	var receiver = request.emailUser;
	var link = host + 'results/'+request.uuid;
	var subject = "Result from Ribosoft for request "+request.uuid;
	var message = "Hello,<br/><p>Your request has now been completed. You can view the results at the address :<a href='"+link+"' />"+link+"</a>.<br/><br/>Regards,<br/>The Ribosoft Team</p>";

	var mailOptions = {
	    from: "Ribosoft <ribosoft.mailer@gmail.com>", 
	    to: receiver, 
	    subject: subject,
	    html: message
	}

	smtpTransport.sendMail(mailOptions, function(err, response){
	    if(err){
		errorArray.push(err);
	    }
	    request.status = 5;
	    request.save(function(err, req){
		if(err) errorArray.push(err);
	    });
	});


    });
    smtpTransport.close();
    if(errorArray.length != 0)
	callback(errorArray);
    callback(null);
};



