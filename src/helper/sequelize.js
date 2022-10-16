const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  username: "root",
  password: "password",
  database: "kepo",
  port: 3306,
  dialect: "mysql",
});

const suka = require("../models/suka")(sequelize);

module.exports = {
  sequelize,
  suka,
};
