import jwt from "jsonwebtoken"
import moment from "moment"
import { Token } from "./../model/token.Collection.js"
import env from "../config/env.js"
import { User } from "../model/user.Collection.js"

export const generateToken = (
  userId,
  expires,
  type,
  secret = env.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment(expires).unix(),
    type
  }
  return jwt.sign(payload, secret)
}

export const saveToken = async (token, userId, expires, type) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type
  })
  return tokenDoc
}

export const verifyToken = async (
  token,
  secret = env.jwt.secret,
  type
) => {
  const payload = jwt.verify(token, secret)
  const verifyToken = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false
  })
  if (!verifyToken) {
    throw new Error("Token not found")
  }
  return verifyToken
}

export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    env.jwt.access_expiration,
    "minutes"
  )
  const accessToken = generateToken(user.id, accessTokenExpires, "ACCESS")
  const refreshTokenExpires = moment().add(
    env.jwt.refresh_expiration,
    "days"
  )

  const refreshToken = generateToken(user.id, refreshTokenExpires, "REFRESH")

  await saveToken(refreshToken, user.id, refreshTokenExpires, "REFRESH")

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires
    }
  }
}

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized, no token provided")
  }
  const token = bearer.split("Bearer ")[1].trim()
  try {
    const secret = env.jwt.secret
    const payload = jwt.verify(token, secret)
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(401).send("Unauthorized, user not found")
    }
    req.user = User
    next()
  } catch (error) {
    return res.status(401).send("Unauthorized, invalid token")
  }
}
