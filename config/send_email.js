const nodemailer = require('nodemailer');
module.exports.send_email=(to,subject,text,html)=>{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
          user: 'jenishkl21@gmail.com',
          pass: 'fhtljjojpsgnpuzk'
        }
      });
      
      var mailOptions = {
        from:"jenishkl21@gmail.com",
        to,
        subject,
        text,
        html,
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return(error)
        } else {
          console.log('Email sent: ' + info.response);
          return(info.response)
        }
      });



}
