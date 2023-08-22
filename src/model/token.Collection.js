import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    trim: true
  },
  expires: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ["REFRESH", "RESET_PASSWORD"],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  blacklisted: {
    type: Boolean,
    default: false
  }
})

tokenSchema.statics.isTokenBlacklisted = async function (token) {
  const foundToken = await this.findOne({ token, blacklisted: true })
  return !!foundToken
}

export const Token = mongoose.model("Token", tokenSchema)
