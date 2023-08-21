import {
  createUser,
  getOneUser,
  getAllUsers,
  refreshAuth,
  loginUser,
  logoutService,
} from "./users.service.js";
import httpStatus from "http-status";
import { generateAuthTokens } from "../modules/auth.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    const user = await createUser(username, email, password);
    const tokens = await generateAuthTokens(user);
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User created successfully", tokens });
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await getAllUsers();
  return res.status(httpStatus.OK).json(users);
};

export const getUser = async (req, res) => {
  const { username } = req.params;
  const user = await getOneUser(username);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
  }
  return res.status(httpStatus.OK).json(user);
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await loginUser(username, password);
    const tokens = await generateAuthTokens(user);
    return res.status(httpStatus.OK).json(tokens);
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  await logoutService(refreshToken);
  return res.status(httpStatus.OK).json({ message: "Logout successful" });
};

export const refreshTokens = async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await refreshAuth(refreshToken);
  return res.status(httpStatus.OK).json(tokens);
};
