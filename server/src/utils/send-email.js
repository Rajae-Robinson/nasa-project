const nodemailer = require('nodemailer');
const { promisify } = require('util');

async function sendEmail({options}) {
    // Send the reset link via email
  const transporter = nodemailer.createTransport({
    // Gmail not ideal for prod due to spam restrictions
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: options.email,
    from: `Test <${process.env.EMAIL_USER}>`,
    subject: options.subject,
    text: options.message,
  };

  const sendMail = promisify(transporter.sendMail).bind(transporter);
  await sendMail(mailOptions);
}

module.exports = {
    sendEmail
}