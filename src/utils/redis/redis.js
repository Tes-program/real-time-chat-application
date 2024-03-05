import { createClient } from "redis"
import env from "../../config/env.js"

// Create a new Redis client
export const redisClient = createClient(env.redis.url)

export function isRedisConnected () {
  return new Promise((resolve, reject) => {
    redisClient.on("ready", () => {
      resolve(true)
    })
    redisClient.on("error", (err) => {
      reject(err)
    })
  })
}
