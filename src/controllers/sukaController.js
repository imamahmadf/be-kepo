const { db } = require("../database");
const { suka } = require("../helper/sequelize");

module.exports = {
  // getSuka: (req, res) => {
  //   console.log("suka " + req.params.idSuka);
  //   let sqlGet = `select * from suka where id_post = ${db.escape(
  //     parseInt(req.params.idSuka)
  //   )};`;

  //   db.query(sqlGet, (err, results) => {
  //     console.log(results);
  //     if (err) {
  //       res.status(500).send(err);
  //     }
  //     res.status(200).send(results);
  //   });
  // },
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

  getSuka: async (req, res) => {
    const result = await suka.findAll({
      where: {
        id_post: parseInt(req.params.idSuka),
      },
    });

    return res.send(result);
  },
};
