import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { userRoute } from "./users/index.js";

dotenv.config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(express.json());
app.use("/user", userRoute);
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

export default app;
