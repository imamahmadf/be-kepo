const { db } = require("../database");
const { createToken } = require("../helper/createToken");
const Crypto = require("crypto");
const transporter = require("../helper/nodemailer");

module.exports = {
  getLogin: (req, res) => {
    console.log("nama pengguna" + req.query.namaPengguna);
    console.log("katasandi" + req.query.kataSandi);

    let scriptQuery = `select * from users where namaPengguna= ${db.escape(
      req.query.namaPengguna
    )} or email= ${db.escape(
      req.query.namaPengguna
    )} and kataSandi = ${db.escape(req.query.kataSandi)};`;

    db.query(scriptQuery, (err, result) => {
      console.log(scriptQuery);
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },

  addUser: (req, res) => {
    console.log(req.body);
    let { username, email, password } = req.body;
    password = Crypto.createHmac("sha1", "hash123")
      .update(password)
      .digest("hex");
    console.log(password);
    let insertQuery = `Insert into users values (null,${db.escape(
      username
    )},${db.escape(email)},${db.escape(password)},'unverified');`;
    console.log(insertQuery);
    db.query(insertQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      if (results.insertId) {
        let sqlGet = `Select * from users where idusers = ${results.insertId};`;
        db.query(sqlGet, (err2, results2) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2);
          }

          // bahan data untuk membuat token
          let { idusers, username, email, role, status } = results2[0];
          // membuat token
          let token = createToken({ idusers, username, email, role, status });

          let mail = {
            from: `Admin <leadwear01@gmail.com>`,
            to: `${email}`,
            subject: "Account Verification",
            html: `<a href='http://localhost:3001/authentication/${token}'>Click here for verification your account</a>`,
          };

          transporter.sendMail(mail, (errMail, resMail) => {
            if (errMail) {
              console.log(errMail);
              res.status(500).send({
                message: "Registration Failed!",
                success: false,
                err: errMail,
              });
            }
            res.status(200).send({
              message: "Registration Success, Check Your Email!",
              success: true,
            });
          });
        });
      }
    });
  },
};
