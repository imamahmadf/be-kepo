const { db } = require("../database");

module.exports = {
  getKomen: (req, res) => {
    console.log(req.params.idKomen);
    let sqlGet = `select idkomentar, isi, id_post, id_user, namaPengguna, fotoProfil
    from komentar k join post p on p.id_post = k.id_komen_ini_ada_di_post_apa
    join users u on u.id_user = k.id_user_yg_komen where id_post = ${db.escape(
      req.params.idKomen
    )};`;

    db.query(sqlGet, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  postKomen: (req, res) => {
    console.log(req.body);
    console.log("ini params post komen " + req.params.idKomenPost);
    const { isi, id_user_yg_komen, id_komen_ini_ada_di_post_apa } = req.body;
    let sqlGet = ` INSERT INTO komentar VALUES (null, ${db.escape(
      isi
    )}, ${db.escape(id_user_yg_komen)}, ${db.escape(
      id_komen_ini_ada_di_post_apa
    )} );`;
    console.log(sqlGet);

    db.query(sqlGet, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
};
