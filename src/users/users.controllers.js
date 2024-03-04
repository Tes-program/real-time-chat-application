import httpStatus from "http-status"
import { getAllUsers, getOneUser } from "./users.service.js"

export const getUsers = async (req, res) => {
  const users = await getAllUsers()
  return res.status(httpStatus.OK).json({ users })
}

export const getUser = async (req, res) => {
  const { username } = req.params
  const user = await getOneUser(username)
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" })
  }
  return res.status(httpStatus.OK).json(user)
}
