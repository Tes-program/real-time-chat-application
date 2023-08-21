import jwt from "jsonwebtoken";
import moment from "moment";
import { Token } from "./../model/token.Collection.js";

export const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET,
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

export const saveToken = async (token, userId, expires, type) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
  });
  return tokenDoc;
};

export const verifyToken = async (
  token,
  secret = process.env.JWT_SECRET,
  type,
) => {
  const payload = jwt.verify(token, secret);
  const verifyToken = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!verifyToken) {
    throw new Error("Token not found");
  }
  return verifyToken;
};

export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes",
  );
  const accessToken = generateToken(user.id, accessTokenExpires, "ACCESS");
  const refreshTokenExpires = moment().add(
    process.env.JWT_REFRESH_EXPIRATION_DAYS,
    "days",
  );

  const refreshToken = generateToken(user.id, refreshTokenExpires, "REFRESH");

  await saveToken(refreshToken, user.id, refreshTokenExpires, "REFRESH");

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
