import usersValidation from "./auth.validation.js"
import {
  register,
  refreshTokens,
  login,
  logout
} from "./auth.controllers.js"
import express from "express"
import validate from "../modules/validate.js"

const router = express.Router()

router.post("/register", validate(usersValidation.register), register)
router.post("/login", validate(usersValidation.login), login)
router.post("/logout", validate(usersValidation.logout), logout)
router.post(
  "/refresh-tokens",
  validate(usersValidation.refreshTokens),
  refreshTokens
)

export default router
