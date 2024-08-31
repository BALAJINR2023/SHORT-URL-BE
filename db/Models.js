import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
      type: "string",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
    isVerfied:{
      type: "boolean",
      required: false,
    },
  });
const userModel = new mongoose.model("user", userSchema, "users");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  urlId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
});

const UrlModel = new mongoose.model('Url', urlSchema);
 export {userModel, UrlModel};
  