const express = require("express");
const { Mongoose } = require("mongoose");
const requireLogin = require('../middleware/requireLogin')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require('dotenv').config();

const router = express.Router();
const User = require("../models/user");

router.get("/user",requireLogin,(req,res)=>{
    res.send('Will Get all Users Details')
});

router.post("/signup", (req, res) => {
  
  const { fullName, email, password } = req.body;

  // first check fullName ,email, password should not be empty

  if (!fullName || !email || !password)
    return res.status(422).json({ error: "Enter all The details !!" });

  // if it's not empty then check user existence with the help of email
  User.findOne({ email: email })
    .then((user) => {
      if (user)
        return res.status(403).json({
          message: "User Already Registered With This Email !!",
        });

      // if User is not registered then convert password to hash_password and save into DB.

      bcrypt
        .hash(password, process.env.SALT)
        .then((hashedPassword) => {
          const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
          });
          newUser
            .save()
            .then((savedUser) => {
              res.status(200).json({
                message: "User Signed Up Successfully !!!",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          res.status(400).json({ error : err });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  //email and password should not be empty or null
  if (!email || !password)
    return res.status(400).json({
      error: "Please fill All the details",
    });

// Check User existence
  User.findOne({ email: email }).then((user) => {
    if (!user)
      return res.status(423).json({
        message: "User is not registered with this email !!",
      });

    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ id: user._id },process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
          });
          res.json({ token });
        } 
        else return res.status(404).json({ err: "Password Not Matched Try Again ?" });
      })
      .catch((err) => {
        res.status(404).json({ err: err });
      });
  });
});
module.exports = router;
