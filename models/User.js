import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  password: String,
  email: { type: String, unique: true },
  aadhaar: String,
  address: String,
  permanentAddress: String,
  state: String,
  city: String
});

const User = mongoose.model("User", userSchema);
export default User;
