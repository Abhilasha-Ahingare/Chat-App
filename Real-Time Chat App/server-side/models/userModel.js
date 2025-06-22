const { genSalt, hash } = require("bcrypt");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  image: { type: String },
  color: { type: String, required: false },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

// 🔐 Password Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  try {
    const salt = await genSalt(10); 
    this.password = await hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = model("User", userSchema);

module.exports = User;
