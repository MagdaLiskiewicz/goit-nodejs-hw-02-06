const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../../controllers/authController");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

router.post("/signup", register);

router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/current", authMiddleware, getCurrentUser);

module.exports = router;
