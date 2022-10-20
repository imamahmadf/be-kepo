const { db } = require("../database");
const { uploader } = require("../helper/uploader");
const fs = require("fs");

module.exports = {
  postImage: (req, res) => {
    console.log("uploader foto " + req.file);
    const { keterangan, id_user_yg_post, lokasi, tanggal } = req.body;
    // console.log("uploader foto2 " + req.body);

    const filePath = "post";
    const { filename } = req.file;

    let sqlInsert = `Insert into post values (
      null,
      ${db.escape(`/${filePath}/${filename}`)},
      ${db.escape(keterangan)},
      ${db.escape(id_user_yg_post)},
      ${db.escape(lokasi)},  ${db.escape(tanggal)});`;

    db.query(sqlInsert, (err, results) => {
      console.log(sqlInsert);
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  // uploadFile: (req, res) => {
  //   try {
  //     let path = "/images";
  //     const upload = uploader(path, "IMG").fields([{ name: "file" }]);

  //     upload(req, res, (error) => {
  //       if (error) {
  //         console.log(error);
  //         res.status(500).send(error);
  //       }

  //       const { file } = req.files;
  //       const filepath = file ? path + "/" + file[0].filename : null;

  //       let data = JSON.parse(req.body.data);
  //       data.image = filepath;
  //       let sqlInsert = `Insert into post values (
  //         null,
  //         ${db.escape(filepath)},
  //         ${db.escape(data.keterangan)},
  //         ${db.escape(data.id_user_yg_post)},
  //         ${db.escape(data.lokasi)});`;

  //       console.log(sqlInsert);
  //       db.query(sqlInsert, (err, results) => {
  //         if (err) {
  //           fs.unlinkSync("./public" + filepath);
  //           res.status(500).send(err);
  //         }
  //         res.status(200).send({ message: "Upload file success" });
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send(error);
  //   }
  // },
  getPost: (req, res) => {
    let sqlGet =
      "select id_post, foto, keterangan, id_user, lokasi, namaPengguna, fotoProfil, tanggal, (select count(id_post) from suka s where s.id_post = p.id_post) total_suka, (select count(id_komen_ini_ada_di_post_apa) from komentar k where k.id_komen_ini_ada_di_post_apa = p.id_post) total_komentar from post p join users u on u.id_user= p.id_user_yg_post Order by id_post DESC limit 3 offset 0;";

    db.query(sqlGet, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  getContent: (req, res) => {
    console.log(req.params.idContent);
    let sqlGet = `select id_post, foto, keterangan, id_user, lokasi, namaPengguna, fotoProfil, tanggal from post p join users u on u.id_user= p.id_user_yg_post where id_post = ${db.escape(
      req.params.idContent
    )};`;

    db.query(sqlGet, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  editPost: (req, res) => {
    console.log(req.params.idEdit);
    const { lokasi, keterangan } = req.body;
    let sqlGet = `UPDATE post set keterangan = ${db.escape(
      keterangan
    )}, lokasi = ${db.escape(lokasi)} where id_post = ${db.escape(
      req.params.idEdit
    )};`;

    db.query(sqlGet, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },

  deletePost: (req, res) => {
    const path = `${__dirname}/../public/${req.body.old_img}`;

    console.log("path: " + path);

    //file system
    // library yang dapat mengakses directory/file yg ada di sistem/server
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      //file removed
    });

    console.log("params " + req.params.idDelete);
    console.log(req.body);
    let sqlGet = `delete p, k from post p left join komentar k on p.id_post = k.id_komen_ini_ada_di_post_apa where p.id_post =${db.escape(
      req.params.idDelete
    )};`;

    db.query(sqlGet, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send("tessss");
    });
  },

  getProfile: (req, res) => {
    console.log(req.params.username);
    let sqlGet = `select id_post, foto, keterangan, id_user, lokasi, namaPengguna, fotoProfil, tanggal, 
    (select count(id_post) from suka s where s.id_post = p.id_post) total_suka,
    (select count(id_komen_ini_ada_di_post_apa) from komentar k where k.id_komen_ini_ada_di_post_apa = p.id_post) total_komentar
    from post p join users u on u.id_user= p.id_user_yg_post where namaPengguna = ${db.escape(
      req.params.username
    )} Order by id_post DESC;`;

    db.query(sqlGet, (err, results) => {
      console.log(results.data);
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
};
