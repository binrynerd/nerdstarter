const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "chintu.b401@gmail.com", // generated ethereal user
      pass: "ueyvqqjsszcesegm", // generated ethereal password
    },
  });
module.exports = {
   sendMail : function(req, res){
    const { name, email, subject, message } = req.body;

    let mailOptions = {
      from:"toxicsite0@gmail.com", // sender address
      to: 'toxicsite0@gmail.com', // list of receivers
      subject: subject, // Subject line
       text: `User ${req.body.name} with email ${req.body.email} has submitted the following query: ${req.body.message}`, // plain text body
       html:`<h2>Hello I am addi from dj site dt acont ${name + email}</h2>`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      }else{
        res.send('Email sented successfully')
      }
    });

    }
}