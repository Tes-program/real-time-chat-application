import usersValidation from "./users.validation.js";
import {
  register,
  refreshTokens,
  login,
  logout,
  getUser,
  getUsers,
} from "./users.controllers.js";
import express from "express";
import validate from "../modules/validate.js";

const router = express.Router();

router.post("/register", validate(usersValidation.register), register);
router.post("/login", validate(usersValidation.login), login);
router.post("/logout", validate(usersValidation.logout), logout);
router.post(
  "/refresh-tokens",
  validate(usersValidation.refreshTokens),
  refreshTokens,
);
router.get("/users", validate(usersValidation.getUsers), getUsers);
router.get("/users/:username", validate(usersValidation.getUser), getUser);

export default router;
