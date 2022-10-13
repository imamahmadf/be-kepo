const { Router } = require("express");
const express = require("express");

const { userController } = require("../controllers");
const routers = express.Router();

routers.get("/login", userController.getLogin);
routers.post("/register", userController.addUser);

module.exports = routers;
