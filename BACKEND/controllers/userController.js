const {
  userServices,
  utilServices,
  emailServices,
  jwtServices,
} = require("../services");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).send({ error: "Cannot accept an empty field!" });
    }
    if (!utilServices.isValidEmailFormat(email))
      return res.status(422).send({ error: "Wrong Format for Email!" });

    if (!utilServices.isValidPasswordFormat(password))
      return res.status(422).send({
        error: "Wrong Format for Password",
      });

    const user = await userServices.findUser({ email: email });
    if (user) {
      return res.status(400).send({ error: "User already exist!" });
    }

    await userServices.addUser({
      name: name,
      email: email,
      password: password,
    });

    return res.status(200).json({
      message: "Signup successful.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json("Something went wrong at server!");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.send("Cannot accept an empty field!");

    const user = await userServices.findUser({ email: email });
    if (!user) {
      return res.status(404).send({ error: "Incorrect Credentials!" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(404).send({ error: "Password does not match!" });

    const foundUser = await userServices.findUser({
      email: email,
    });

    const token = jwtServices.generateTokenWithSecret(
      {
        email: foundUser.email,
        id: foundUser._id,
      },
      process.env.SECRET_KEY
    );

    return res
      .set("access-control-expose-headers", "access_token")
      .header("access_token", token)
      .status(200)
      .json({
        data: { User: user },
        message: "Login successful",
      });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong at server!");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, password } = req?.body;

    if (!name || !password)
      return res.status(422).send("Cant accept empty fields");
    if (!utilServices.isValidPasswordFormat(password))
      return res.status(422).send("Incorrect Password Format");

    const user = await userServices.updateUser(
      { _id: req.userId },
      { name: name, password: password },
      { new: true }
    );

    if (!user) {
      return res.status(422).send({ error: "Couldn't Update User Profile!" });
    }

    return res.status(200).json({
      message: `User Profile Successfully Updated.`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Something went Wrong." });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(404).send({ error: "Cannot accept an empty field!" });

    const user = await userServices.updateUser(
      { email: email },
      {
        has_forgot_password: true,
      }
    );
    if (!user) {
      return res.status(404).send({ error: "Email does not exist!" });
    }

    const token = jwtServices.generateTokenWithSecret(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY
    );

    emailServices.sendEmail(
      email,
      `Reset Password`,
      `${process.env.FRONT_END_URL}/users/reset_password/${token}`,
      `Warning: Dont share the link with anyone!!! \nUse the given link to reset your password.`
    );

    return res.status(200).json({
      message:
        "Check inbox for reset link.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong!");
  }
};

const resetPassword = async (req, res) => {
  try {
    let { token } = req.params;
    if (token) {
      let { id } = jwtServices.verifyToken(token, process.env.SECRET_KEY);
      req.userId = id;
    } else return res.status(401).send({ error: "Unauthorized user" });

    const { newPassword } = req.body;

    if (!newPassword)
      return res.status(422).send("Cannot accept an empty field!");

    if (!utilServices.isValidPasswordFormat(newPassword))
      return res.status(422).send({
        error: "Wrong Format for new Password!",
      });

    const findUser = await userServices.findUser({ _id: req.userId });
    if (!findUser.has_forgot_password)
      return res.status(422).send({
        error: "Inavlid or Outdated Reset Link",
      });

    const user = await userServices.updateUser(
      { _id: new mongoose.Types.ObjectId(req.userId) },
      {
        password: newPassword,
        has_forgot_password: false,
      }
    );

    if (!user) {
      return res.status(422).send({ error: "Couldn't Reset Password!" });
    }

    return res.status(200).json({ message: "Password Successfully Updated." });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ error: "Unauthorized User!!!." });
  }
};

module.exports = {
  login,
  signup,
  updateProfile,
  forgetPassword,
  resetPassword,
};
