//importing modules
const express = require("express");
const userController = require("../Controllers/userController");
const { signup, login, verifyCode, logout } = userController;
const userAuth = require("../Middlewares/userAuth");
const authMiddleware = require("../Middlewares/authMiddleware");
const db = require("../Models");

const User = db.users;

const router = express.Router();

//signup endpoint
//passing the middleware function to the signup
router.post("/signup", userAuth.saveUser, signup);

//login route
router.post("/login", login);

router.post("/verify-code", verifyCode);

router.post("/logout", authMiddleware, logout);


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    //find a user by their email
    // const user = await User.findOne({
    //   where: {
    //     id: req.user.id,
    //   },
    // });
    if (!user) {
      return res
        .status(404)
        .json({ status: "false", message: "User not found." });
    }
    res.json({ status: "true", user });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
});

module.exports = router;
