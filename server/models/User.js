import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  googleAuth: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });


//  Auto-hash password before saving (only if modified)
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Method to compare password easily
userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};


export default mongoose.model("User", userSchema);
