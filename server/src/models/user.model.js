import mongoose, { Schema } from "mongoose"
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  reports: [{
    upi: { type: String, trim: true },
    createdAt: { type: Date },
    _id: false
  }],
  refreshToken: {
    type: String
  }





}, { timestamps: true })


userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12)

  next()
})


userSchema.methods.passwordCheck = async function (password) {

  return await bcrypt.compare(password, this.password);

}





userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}




export const User = mongoose.model("User", userSchema)


