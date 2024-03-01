import express from "express"
import mongoose from "mongoose"
import * as dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import env from "./config/env.js"
import { userRoute } from "./users/index.js"
import { Logger } from "./config/logger.js"

dotenv.config()

const app = express()

const logger = new Logger()

app.listen(process.env.PORT, () => {
  // console.log(`Server is running on port ${process.env.PORT}`)
  logger.info(`Server is running on port ${env.port}`)
})

app.use(express.json())
app.use("/user", userRoute)
app.use(morgan("dev"))
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose
  .connect(env.mongo.uri, {
    useNewUrlParser: true
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Could not connect to MongoDB", err))

export default app
