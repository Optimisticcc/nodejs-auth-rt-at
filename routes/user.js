const express = require("express");
const User = require("../models/user");
const router = express.Router();
const createError = require("http-errors");
const userValidate = require("../helpers/validation");
const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../service/jwt.service");
const UserController = require("../controller/user.controller");
router.post("/register", UserController.register);

router.post("/refresh-token", UserController.getAccessTokenFromRefreshToken);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.get("/get-list", verifyAccessToken, UserController.getAllUser);
module.exports = router;
