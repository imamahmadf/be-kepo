const express = require("express");

const { komentarController } = require("../controllers");
const routers = express.Router();

routers.get("/:idKomen", komentarController.getKomen);
routers.post("/post/:idKomenPost", komentarController.postKomen);

module.exports = routers;
