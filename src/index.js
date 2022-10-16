const express = require("express");
const cors = require("cors");
const bearerToken = require("express-bearer-token");

const { response } = require("express");
const PORT = 3400;
const app = express();

app.use(cors());
app.use(express.json());

app.use(bearerToken());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).send("<h4>Integrated mysql with express</h4>");
});

const { sequelize } = require("./helper/sequelize");
// sequelize.sync({ alter: true });

const {
  userRouters,
  postRouter,
  komentarRouter,
  sukaRouter,
} = require("./routers");

app.use("/kepo", userRouters);
app.use("/post", postRouter);
app.use("/komentar", komentarRouter);
app.use("/suka", sukaRouter);

app.use("/profil", express.static(`${__dirname}/public/profil`));

app.listen(PORT, () => console.log("API running:", PORT));
