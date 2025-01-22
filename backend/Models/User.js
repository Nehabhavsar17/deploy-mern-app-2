const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        // Regex for validation:
        // - Starts with a lowercase letter
        // - Contains at least one number
        // - Valid email format
        const emailRegex = /^[a-z][a-z0-9]*\d@[a-z]+\.[a-z]+$/;
        const isValidFormat = emailRegex.test(email);

        // Check if email length is within 102 KB (102 * 1024 bytes)
        const isValidSize = Buffer.byteLength(email, "utf-8") <= 102 * 1024;

        return isValidFormat && isValidSize;
      },
      message:
        "Invalid email. Must start with a lowercase letter, include numbers, and be a valid format. Size limit: 102 KB",
    },
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: { type: String },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
