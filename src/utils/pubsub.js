import redis from "redis"
const APPID = process.env.APPID
const connection = []

export const subscriber = redis.createClient({
  port: 6379,
  host: "rds"
})

export const publisher = redis.createClient({
  port: 6379,
  host: "rds"
})

subscriber.on("subscribe", (channel, count) => {
  console.log(`Server ${APPID} subscribed successfully to livechat`)
  publisher.publish("livechat", "Message from server")
})

subscriber.on("message", (channel, message) => {
  try {
    console.log(
      `Server ${APPID} received message: ${message} from channel: ${channel}`
    )
    connection.forEach((c) => c.send(APPID + ": " + message))
  } catch (error) {
    console.log(error)
  }
})

subscriber.subscribe("livechat")
