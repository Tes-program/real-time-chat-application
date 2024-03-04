import joi from "joi"
import path from "path"
import dotenv from "dotenv"
import { Logger } from "./logger.js"

const __dirname = process.cwd()

dotenv.config({
  path: path.resolve(__dirname, ".env")
})

const logger = new Logger()

const envVarsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid("development", "production", "test")
      .required(),
    PORT: joi.number().default(3000),
    MONGO_URI: joi.string().required().description("Mongo DB url"),
    JWT_SECRET: joi
      .string()
      .required()
      .description("JWT Secret required to sign tokens"),
    JWT_ACCESS_EXPIRATION: joi
      .string()
      .required()
      .description("JWT Token expiration time"),
    JWT_REFRESH_EXPIRATION: joi
      .string()
      .required()
      .description("JWT Refresh token expiration time")
  })
  .unknown()
  .required()

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env)

if (error) {
  logger.error(`Config validation error: ${error.message}`)
  process.exit(1)
}

// console.log(error)

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongo: {
    uri: envVars.MONGO_URI
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    access_expiration: envVars.JWT_ACCESS_EXPIRATION,
    refresh_expiration: envVars.JWT_REFRESH_EXPIRATION
  }
}
