//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { VerificationCode } = require("../Models");
const { sendVerificationCode } = require("../Middlewares/emailService");

// Assigning users to the variable User
const User = db.users;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const data = {
      name,
      email,
      role,
      password: await bcrypt.hash(password, 10),
    };
    //saving the user
    const user = await User.create(data);

    //if user details is captured
    //generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      //send users details
      return res.status(201).send(user);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyCode = async (req, res) => {
  try {
    const { userId, code } = req.body;

    // Find the verification code in the database
    const verificationCode = await VerificationCode.findOne({
      where: {
        user_id: userId,
        code: code,
        already_used: false,
      },
    });

    if (verificationCode) {
      // Mark the verification code as used
      verificationCode.already_used = true;
      await verificationCode.save();
      // Code is valid
      return res
        .status(200)
        .json({ status: "true", message: "Verification successful." });
    } else {
      // Code is invalid or expired
      return res.status(400).json({
        status: "false",
        message: "Invalid or expired verification code.",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "false", message: "Internal server error." });
  }
};

//login authentication

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        // Generate a verification code
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes

        // Store the verification code in the database
        await VerificationCode.create({
          user_id: user.id,
          code: verificationCode,
        });

        // await sendVerificationCode(user.email, verificationCode);

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        //send user data
        return res.status(200).json({ token: token, user: user });
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
  verifyCode,
};
