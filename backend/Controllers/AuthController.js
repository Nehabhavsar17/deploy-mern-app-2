const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profileImage = req.file?.path;

    const user = await UserModel.findOne({ email });

    const emailRegex = /^[a-z][a-z0-9]*\d@[a-z]+\.[a-z]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)  
        .json({ message: "Invalid email format", success: false });
    }
    const isEmailValid = (email) => {
      const MAX_EMAIL_LENGTH = 254; // Max allowed length of an email address
      const MAX_LOCAL_LENGTH = 64; // Max allowed length of the local part (before '@')
      const [localPart, domainPart] = email.split("@");

      // Check overall email length, local part, domain part, and regex validation
      if (
        email.length > MAX_EMAIL_LENGTH || // Total length validation
        !emailRegex.test(email) || // Regex validation
        !localPart || // Ensure local part exists
        !domainPart || // Ensure domain part exists
        localPart.length > MAX_LOCAL_LENGTH || // Local part length validation
        domainPart.length > MAX_EMAIL_LENGTH - MAX_LOCAL_LENGTH - 1 // Domain length validation
      ) {
        return false; // Invalid email
      }
      return true; // Valid email
    };

    const passwordRegex = /^[A-Z][a-zA-Z]*\d.*$/; 
    if (!passwordRegex.test(password) || password.length < 6) {
      return res.status(400).json({
        message:
          "Password must start with an uppercase letter, contain at least one number, and be at least 6 characters long",
        success: false,
      });
    }

    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      });
    }
    const userModel = new UserModel({ name, email, password, profileImage });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is wrong";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
      profileImage: user.profileImage ? `${req.protocol}://${req.get('host')}/image/${user.profileImage.split('uploads\\')[1]}` : null, // Correctly format the image URL
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};
