const express = require("express");

const { sukaController } = require("../controllers");
const routers = express.Router();

routers.get("/get/:idSuka", sukaController.getSuka);
routers.post("/post/:idSuka", sukaController.postSuka);
// ngetes aja
// routers.get("/coba/:idSuka", sukaController.sukaCoba);

module.exports = routers;
