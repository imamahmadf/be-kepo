const { Router } = require("express");
const express = require("express");
const { auth } = require("../helper/authToken");
const { userController } = require("../controllers");
const routers = express.Router();
const fileUploader = require("../helper/uploader");

routers.get("/login", userController.getLogin);
routers.post("/register", userController.addUser);
routers.patch("/verified", auth, userController.verification);
routers.patch(
  "/edit",
  fileUploader({
    destinationFolder: "post",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  userController.editUser
);

module.exports = routers;
