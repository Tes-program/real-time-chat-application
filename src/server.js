import express from "express"
import mongoose from "mongoose"
import * as dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import env from "./config/env.js"
import { authRoute } from "./auth/index.js"
import { Logger } from "./config/logger.js"
import { protect } from "./modules/auth.js"
import { userRoute } from "./users/index.js"
import { isRedisConnected } from "./utils/redis/redis.js"

dotenv.config()

const app = express()

const logger = new Logger()

app.listen(process.env.PORT, () => {
  // console.log(`Server is running on port ${process.env.PORT}`)
  logger.info(`Server is running on port ${env.port}`)
})

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} ${req.ip}`)
  next()
})

app.get("/", (req, res) => {
  res.send("Welcome to the Real Time Chat Application using Websockets and JWT Authentication")
}
)

app.use(express.json())
app.use("/auth", authRoute)
app.use("/users", userRoute, protect)
app.use(morgan("dev"))
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose
  .connect(env.mongo.uri, {
    useNewUrlParser: true
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Could not connect to MongoDB", err));

// Check if Redis is connected
(async () => {
  const connected = await isRedisConnected()
  try {
    if (connected) {
      logger.info("Connected to Redis")
    } else {
      logger.error("Could not connect to Redis")
    }
  } catch (error) {
    logger.error("Could not connect to Redis", error)
  }
})()

export default app
