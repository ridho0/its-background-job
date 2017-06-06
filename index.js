var CronJob = require('cron').CronJob;
var kue = require('kue')
, queue = kue.createQueue();
var mailer = require("nodemailer");
require('dotenv').config()

//Seconds: 0-59, Minutes: 0-59, Hours: 0-23, Day of Month: 1-31, Months: 0-11, Day of Week: 0-6
var smtpTransport = mailer.createTransport({
  service: "gmail.com",
  auth: {
    user: process.env.user,
    pass: process.env.pass
  }
});

new CronJob('0 55 12 6 5 *', function() {

  queueSendEmail("ridho230994@gmail.com")
}, null, true, 'Asia/Jakarta');


function queueSendEmail(email) {
  var job = queue.create('sendEmail', {
    from: "Ridho Pratama <from@gmail.com>",
    to: email,
    subject: "Send Email Using Node.js",
    text: "Node.js New world for me",
    html: "<b>Node.js New world for me</b>"
  }).save( function(err){
     if( !err ) console.log( job.id );
  });

  queue.process('sendEmail', function(mail, done){
    smtpTransport.sendMail(mail.data, function(error, response){
      if(error){
        console.log(error);
      }else{
        console.log("Message sent: " + mail.to);
      }
      smtpTransport.close();
    });
    done()

  });
}

// var https = require('https');
//
// var data = JSON.stringify({
//  api_key: process.env.api_key,
//  api_secret: process.env.api_secret,
//  to: '6282257028810',
//  from: '6282257028810',
//  text: 'Hello from Nexmo'
// });
//
// var options = {
//  host: 'rest.nexmo.com',
//  path: '/sms/json',
//  port: 443,
//  method: 'POST',
//  headers: {
//    'Content-Type': 'application/json',
//    'Content-Length': Buffer.byteLength(data)
//  }
// };
//
// var req = https.request(options);
//
// req.write(data);
// req.end();
//
// var responseData = '';
// req.on('response', function(res){
//  res.on('data', function(chunk){
//    responseData += chunk;
//  });
//
//  res.on('end', function(){
//    console.log(JSON.parse(responseData));
//  });
// });
