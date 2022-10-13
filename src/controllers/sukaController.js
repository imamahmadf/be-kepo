const { db } = require("../database");

module.exports = {
  getSuka: (req, res) => {
    console.log("suka " + req.params.idSuka);
    let sqlGet = `select * from suka where id_post = ${db.escape(
      parseInt(req.params.idSuka)
    )};`;

    db.query(sqlGet, (err, results) => {
      console.log(results);
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  postSuka: (req, res) => {
    console.log("suka " + req.params.idSuka);
    let sqlGet = `select * from suka where id_post = ${db.escape(
      parseInt(req.params.idSuka)
    )};`;

    db.query(sqlGet, (err, results) => {
      console.log(results);
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
};
