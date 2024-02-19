const router = require("express").Router();
const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Your Gmail email address
    pass: "your-password", // Your Gmail password (Use environment variables for security)
  },
});

router.post("/new", async (req, res) => {
  const otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  try {
    const userExist = await User.findOne({ email: req.body.email });
    const phoneExist = await User.findOne({ phone: req.body.phone });

    if (userExist) {
      throw new Error("This Email Has Already Been Used");
    }

    if (phoneExist) {
      throw new Error("This Phone Number Has Already Been Used");
    }

    const hash = bcrypt.hashSync(req.body.password, 10);

    // You should not assign to const, so use 'let' instead
    let newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hash,
      role: req.body.role,
      status: req.body.status,
      verified: "false",
      otp: otp,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWTSECRET);

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "payestate3@gmail.com",
        pass: "aqcreedpdggrsfbx",
      },
    });
    const mailOptions = {
      from: "PayFoods",
      to: req.body.email,
      subject: "Your PayFood Verification",
      text: `
        Your verification code for payfood is ${newUser.otp} input it on the verification form to verify your account
        `,
    };
    await transport.sendMail(mailOptions);

    res.send({
      success: true,
      message: "User Created Successfully check email for verification",
      data: token,
      id: newUser._id,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      throw new Error("user does not exist");
    }
    const pass = bcrypt.compareSync(user.password, req.body.password);
    if (pass) {
      throw new Error("invalid password");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWTSECRET);
    res.send({
      success: true,
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/current-user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
router.post("/verify/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.otp) {
      throw new Error("OTP not generated for this user");
    }

    if (req.body.code != user.otp) {
      throw new Error("Invalid Code");
    } else {
      // Update the user document with the new OTP code
      await User.findByIdAndUpdate(req.params.id, { verified: "true" });
      res.send({
        success: true,
        message: "Verification complete",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
