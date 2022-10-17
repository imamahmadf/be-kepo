const { db } = require("../database");
const { createToken } = require("../helper/createToken");
const Crypto = require("crypto");
const transporter = require("../helper/nodemailer");
const fs = require("fs");

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
    let { namaPengguna, nama, fotoProfil, bio, email, kataSandi } = req.body;
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
          let { idusers, username, email, role, status } = results2[0];
          // membuat token
          let token = createToken({ idusers, username, email, role, status });

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

  editUser: (req, res) => {
    console.log("edit profile1 " + req);

    const { editNama, editNamaPengguna, editBio, id_user, old_img } = req.body;

    const filePath = "profil";

    let editData = {};
    if (req.file?.filename) {
      const { filename } = req.file;

      const path = `${__dirname}/../public/${old_img}`;
      fs.unlink(path, (err) => {
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
        id_user,
        foto: `/${filePath}/${filename}`,
      };

      let sqlEdit = `UPDATE users set nama = ${db.escape(
        editData.editNama
      )}, namaPengguna = ${db.escape(
        editData.editNamaPengguna
      )}, fotoProfil = ${db.escape(editData.foto)}, bio = ${db.escape(
        editData.editBio
      )} where id_user = ${db.escape(editData.id_user)};`;

      console.log(sqlEdit);
      db.query(sqlEdit, (err, results) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(results);
      });
    } else {
      editData = {
        editNama,
        editNamaPengguna,
        editBio,
        id,
      };
      console.log("tes" + editData.editNama);
      let sqlEdit = `UPDATE users set nama = ${db.escape(
        editData.editNama
      )}, namaPengguna = ${db.escape(
        editData.editNamaPengguna
      )},  bio = ${db.escape(editData.editBio)} where id_user = ${db.escape(
        editData.id
      )};`;

      db.query(sqlEdit, (err, results) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(results);
      });
    }
  },

  // /////////////contoh///////////////
  editMovie: async (req, res) => {
    const {
      film_name,
      duration,
      year_released,
      rating,
      about,
      studioId,
      old_img,
      id,
    } = req.body;
    const uploadFileDomain = "http://localhost:2000";
    const filePath = "movie_images";

    let editData = {};

    if (req.file?.filename) {
      // ada perubahan gambar
      const { filename } = req.file;

      const path = `${__dirname}/../public/movie_images/${old_img}`;
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        //file removed
      });

      editData = {
        film_name,
        duration,
        year_released,
        rating,
        img_src: `${uploadFileDomain}/${filePath}/${filename}`,
        about,
        studioId,
      };
    } else {
      editData = {
        film_name,
        duration,
        year_released,
        rating,
        about,
        studioId,
      };
    }
    await Movie.update(
      { ...editData },
      {
        where: { id },
      }
    );

    return res.send("movie edited");
  },
};
