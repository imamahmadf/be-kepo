const express = require("express");
const { postController } = require("../controllers");
const route = express.Router();

route.post("/upload", postController.uploadFile);
route.get("/get", postController.getPost);
route.get("/:idContent", postController.getContent);
route.patch("/edit/:idEdit", postController.editPost);
route.delete("/delete/:idDelete", postController.deletePost);
route.get("/profile/:username", postController.getProfile);
module.exports = route;
