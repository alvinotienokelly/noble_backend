//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { VerificationCode } = require("../Models");
const { sendVerificationCode } = require("../Middlewares/emailService");

// Assigning users to the variable User
const User = db.users;

// Utility function to mask email
const maskEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart =
    localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
  return `${maskedLocalPart}@${domain}`;
};

//logout function
const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1, httpOnly: true });
  return res.status(200).json({ status: true, message: "Logout successful." });
};

// Function to get users by type
const getUsersByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    // Find users by their type with pagination
    const { count: totalUsersCount, rows: users } = await User.findAndCountAll({
      where: {
        role: type,
      },
      offset,
      limit: parseInt(limit),
    });

    const kycStatusCounts = await User.findAll({
      attributes: [
        "kyc_status",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("kyc_status")), "count"],
      ],
      group: ["kyc_status"],
    });

    const counts = {
      Verified: 0,
      Rejected: 0,
    };

    kycStatusCounts.forEach((item) => {
      counts[item.kyc_status] = parseInt(item.dataValues.count, 10);
    });

    const totalPages = Math.ceil(totalUsersCount / limit);

    if (users.length > 0) {
      return res.status(200).json({
        status: true,
        totalUsersCount,
        totalPages,
        currentPage: parseInt(page),
        activeUsersCount: counts.Verified,
        rejectedUsersCount: counts.Rejected,
        users,
      });
    } else {
      return res
        .status(200)
        .json({ status: false, message: "No users found." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//forgot password function
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationCode.create({ user_id: user.id, code });

    await sendVerificationCode(email, code);

    res.status(200).json({
      status: true,
      message: "Verification code sent to email." + code,
    });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

//reset password function
const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Password reset successful." });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      password,
      preference_sector,
      preference_region,
    } = req.body;
    const data = {
      name,
      email,
      role,
      preference_sector,
      preference_region,
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
      return res
        .status(200)
        .json({ status: true, message: "Registration successfull." });
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code, type } = req.body;

    // Find the user in the database
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    // Find the verification code in the database
    const verificationCode = await VerificationCode.findOne({
      where: {
        user_id: user.id,
        code: code,
        already_used: false,
      },
    });

    if (verificationCode) {
      // Mark the verification code as used
      verificationCode.already_used = true;
      await verificationCode.save();
      // Code is valid

      if (type === "forgot-password") {
        return res.status(200).json({
          status: true,
          message: "Verification successful.",
        });
      }

      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: true,
        message: "Verification successful.",
        token: token,
        user: user,
      });
    } else {
      // Code is invalid or expired
      return res.status(200).json({
        status: false,
        message: "Invalid or expired verification code.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: false, message: "Internal server error." });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }, // Exclude the password field from the response
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
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

        await sendVerificationCode(user.email, verificationCode);

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        const maskedEmail = maskEmail(user.email);

        //send user data
        return res.status(200).json({
          status: true,
          message:
            "Veritication code sent to " + maskedEmail + " " + verificationCode,
        });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Invalid password" });
      }
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};

const bulkUploadUsers = async (req, res) => {
  try {
    const { companies } = req.body;
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = companies.map((company) => ({
      name: company,
      email: `${company.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
      profile_image: `https://example.com/images/${company
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")}.jpg`,
      kyc_status: "Verified",
      preference_sector: JSON.stringify(["Tech", "Finance"]),
      preference_region: JSON.stringify(["North America", "Europe"]),
      password: hashedPassword,
      role: "Target Company",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await User.bulkCreate(users);
    res
      .status(200)
      .json({ status: true, message: "Users uploaded successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifyCode,
  logout,
  forgotPassword,
  resetPassword,
  getUsersByType,
  bulkUploadUsers,
  getUserById, 
};
