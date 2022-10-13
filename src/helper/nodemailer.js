const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fahruraziimam22@gmail.com",
    pass: "arnmjnhsouukztpb",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
