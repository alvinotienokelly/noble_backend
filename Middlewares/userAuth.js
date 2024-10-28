//importing modules
const express = require("express");
const db = require("../Models");
//Assigning db.users to User variable
const User = db.users;

//Function to check if name or email already exist in the database
//this is to avoid having two users with the same name and email
const saveUser = async (req, res, next) => {
  //search the database to see if user exist
  try {
    const name = await User.findOne({
      where: {
        name: req.body.name,
      },
    });
    //if name exist in the database respond with a status of 409
    if (name) {
      return res
        .status(200)
        .json({ status: false, message: "name already taken" });
    }

    //checking if email already exist
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    //if email exist in the database respond with a status of 409
    if (emailcheck) {
      return res
        .status(200)
        .json({ status: false, message: "Email already taken" });
        
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

//exporting module
module.exports = {
  saveUser,
};
