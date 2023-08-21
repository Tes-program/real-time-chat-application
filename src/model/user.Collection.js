import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unqiue: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unqiue: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["ONLINE", "OFFLINE"],
    default: "OFFLINE",
  },
  lastSeen: {
    type: Date,
  },
});

userSchema.methods.isEmailTaken = async function (email) {
  const user = await this.constructor.findOne({ email });
  return !!user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  // eslint-disable-next-line no-useless-catch
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

export const User = mongoose.model("User", userSchema);
