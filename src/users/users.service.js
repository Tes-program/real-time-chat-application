import httpStatus from "http-status"
import { User } from "../model/user.Collection.js"
import { generateAuthTokens, verifyToken } from "../modules/auth.js"
import { Token } from "../model/token.Collection.js"

export const createUser = async (username, email, password) => {
  if (await User.findOne({ username })) {
    throw new Error("Username already exists")
  }
  if (await User.findOne({ email })) {
    throw new Error("Email already exists")
  }
  const user = new User({ username, email, password })
  await user.save()
  return user
}

export const getAllUsers = async () => {
  return User.find()
}

/**
 *
 * @param {string} username
 * @returns
 */
export const getOneUser = async (username) => {
  return User.findOne({ username })
}

export const loginUser = async (username, password) => {
  const user = await getOneUser(username)
  if (!user) {
    throw new Error("Invalid username")
  }
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error("Invalid password")
  }
  return user
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 * @throws {Error}
 */
export const logoutService = async (refreshToken) => {
  const refreshAllToken = await Token.findOne({
    token: refreshToken,
    type: "REFRESH",
    blacklisted: false
  })
  if (!refreshAllToken) {
    throw new Error(httpStatus.NOT_FOUND, "Not found")
  }
  await refreshAllToken.remove()
}

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const refreshAuth = async (refreshToken) => {
  const refreshAllToken = await verifyToken(refreshToken, "REFRESH")
  try {
    const user = await User.findById(refreshAllToken.user)
    if (!user) {
      throw new Error(httpStatus.NOT_FOUND, "Not found")
    }
    await refreshAllToken.remove()
    return generateAuthTokens(user)
  } catch (err) {
    throw new Error(httpStatus.UNAUTHORIZED, "Please authenticate")
  }
}
