import { User } from "../model/user.Collection.js"

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
