const { db } = require("../database");
const { createToken } = require("../helper/createToken");
const Crypto = require("crypto");
const transporter = require("../helper/nodemailer");
const fs = require("fs");

module.exports = {
  getLogin: (req, res) => {
    req.query.kataSandi = Crypto.createHmac("sha1", "hash123")
      .update(req.query.kataSandi)
      .digest("hex");
    let scriptQuery = `Select * from users where namaPengguna=${db.escape(
      req.query.namaPengguna
    )} and kataSandi=${db.escape(req.query.kataSandi)} or email = ${db.escape(
      req.query.namaPengguna
    )} ;`;
    console.log(req.query, scriptQuery);
    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      if (results[0]) {
        let {
          id_user,
          namaPengguna,
          email,
          kataSandi,
          nama,
          status,
          bio,
          fotoProfil,
        } = results[0];
        let token = createToken({
          id_user,
          namaPengguna,
          email,
          kataSandi,
          nama,
          status,
          bio,
          fotoProfil,
        });
        if (status != "verified") {
          res.status(200).send(results);
        } else {
          res.status(200).send(results);
        }
      }
    });
  },

  getProfil: (req, res) => {
    let scriptQuery = `select * from users where namaPengguna= ${db.escape(
      req.query.namaPengguna
    )};`;

    db.query(scriptQuery, (err, result) => {
      console.log(scriptQuery);
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },
  addUser: (req, res) => {
    console.log(req.body);
    let { namaPengguna, nama, email, kataSandi, fotoProfil, bio } = req.body;
    kataSandi = Crypto.createHmac("sha1", "hash123")
      .update(kataSandi)
      .digest("hex");
    console.log(kataSandi);
    let insertQuery = `Insert into users values (
      null,
      ${db.escape(nama)},
      ${db.escape(email)},
      ${db.escape(namaPengguna)},
      ${db.escape(kataSandi)},
      ${db.escape(fotoProfil)},
      ${db.escape(bio)},
      'unverified');`;
    console.log(insertQuery);
    db.query(insertQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      if (results.insertId) {
        let sqlGet = `Select * from users where id_user = ${results.insertId};`;
        db.query(sqlGet, (err2, results2) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2);
          }

          // bahan data untuk membuat token
          let { id_user, nama, namaPengguna, email, status } = results2[0];
          // membuat token
          let token = createToken({
            id_user,
            nama,
            namaPengguna,
            email,
            status,
          });

          let mail = {
            from: `Admin <leadwear01@gmail.com>`,
            to: `${email}`,
            subject: "Account Verification",
            html: `<a href='http://localhost:3000/authentication/${token}'>Click here for verification your account</a>`,
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

  verification: (req, res) => {
    console.log(req.user);
    let updateQuery = `Update users set status='verified' where id_user = ${req.user.id_user};`;

    db.query(updateQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send({ message: "Verified Account", success: true });
    });
  },

  editUser: async (req, res) => {
    console.log("iduser" + req.params.idEdit);
    console.log("edit profile1 " + req.body.old_img);

    const { editNama, editNamaPengguna, editBio, old_img } = req.body;

    const filePath = "profil";

    let editData = {};
    if (req.file?.filename) {
      const { filename } = req.file;

      const path = `${__dirname}/../public/${old_img}`;
      await fs.unlink(path, (err) => {
        if (err) {
          console.error("erornya =>" + err);
          return;
        }

        //file removed
      });

      editData = {
        editNama,
        editNamaPengguna,
        editBio,

        foto: `/${filePath}/${filename}`,
      };

      let sqlEdit = `UPDATE users set nama = ${db.escape(
        editData.editNama
      )}, namaPengguna = ${db.escape(
        editData.editNamaPengguna
      )}, fotoProfil = ${db.escape(editData.foto)}, bio = ${db.escape(
        editData.editBio
      )} where id_user = ${db.escape(req.params.idEdit)};`;

      console.log("tess11 " + sqlEdit);

      db.query(sqlEdit, (err, results2) => {
        let sqlGet = `select id_post, id_user, lokasi, namaPengguna, nama, fotoProfil, bio, foto from post p join users u on u.id_user= p.id_user_yg_post where namaPengguna = ${db.escape(
          editData.editNamaPengguna
        )};`;

        db.query(sqlGet, (err, results3) => {
          console.log("tes222" + sqlGet);
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).send(results3);
        });
      });
    } else {
      editData = {
        editNama,
        editNamaPengguna,
        editBio,
      };
      console.log("tes123" + editData.editNama);
      let sqlEdit = `UPDATE users set nama = ${db.escape(
        editData.editNama
      )}, namaPengguna = ${db.escape(
        editData.editNamaPengguna
      )},  bio = ${db.escape(editData.editBio)} where id_user = ${db.escape(
        req.params.idEdit
      )};`;
      console.log("tess11 " + sqlEdit);
      db.query(sqlEdit, (err, results3) => {
        let sqlGet = `select id_post, id_user, lokasi, namaPengguna, nama, fotoProfil, bio, foto from post p join users u on u.id_user= p.id_user_yg_post where namaPengguna = ${db.escape(
          editData.editNamaPengguna
        )};`;
        db.query(sqlGet, (err, results2) => {
          console.log("tes222" + sqlGet);
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).send(results2);
        });
      });
    }
  },
};
