import express from "express"
import { getUsers, getUser } from "./users.controllers.js"
import validate from "../modules/validate.js"
import { getValidateUser, getValidateUsers } from "./users.validation.js"

const router = express.Router()

router.get("/", validate(getValidateUsers), getUsers)
router.get("/:username", validate(getValidateUser), getUser)

export default router
