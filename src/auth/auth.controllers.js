import {
  createUser,
  refreshAuth,
  loginUser,
  logoutService
} from "./auth.service.js"
import httpStatus from "http-status"
import { generateAuthTokens } from "../modules/auth.js"

export const register = async (req, res) => {
  const { username, email, password } = req.body
  // console.log(req.body);
  try {
    const user = await createUser(username, email, password)
    const tokens = await generateAuthTokens(user)
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User created successfully", tokens })
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await loginUser(username, password)
    const tokens = await generateAuthTokens(user)
    return res.status(httpStatus.OK).json(tokens)
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: err.message })
  }
}

export const logout = async (req, res, next) => {
  const { refreshToken } = req.body
  try {
    if (!refreshToken) {
      throw new Error("Refresh token is required")
    } else {
      await logoutService(refreshToken)
      return res.status(httpStatus.OK).json({ message: "Logout successful" })
    }
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: err.message })
  }
}

export const refreshTokens = async (req, res, next) => {
  const { refreshToken } = req.body
  try {
    if (!refreshToken) {
      throw new Error("Refresh token is required")
    } else {
      const tokens = await refreshAuth(refreshToken)
      return res.status(httpStatus.OK).json(tokens)
    }
  } catch (err) {
    return res.status(httpStatus.NOT_ACCEPTABLE).json({ message: err.message })
  }
}
