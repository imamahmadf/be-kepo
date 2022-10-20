const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  username: "root",
  password: "password",
  database: "kepo",
  port: 3306,
  dialect: "mysql",
});

const suka = require("../models/suka")(sequelize);

// users.hasMany(suka, { foreignkey: "id_user" });
// suka.belongsTo(users, { foreignkey: "id_user" });
// post.hasMany(suka, { foreignkey: "id_post" });
// suka.belongsTo(post, { foreignkey: "id_post" });

// users.hasMany(komentar, { foreignkey: "id_user" });
// komentar.belongsTo(users, { foreignkey: "id_user_yg_post" });
// post.hasMany(komentar, { foreignkey: "id_post" });
// komentar.belongsTo(post, { foreignkey: "id_komen_ini_ada_di_post_apa" });

module.exports = {
  sequelize,
  suka,
};
