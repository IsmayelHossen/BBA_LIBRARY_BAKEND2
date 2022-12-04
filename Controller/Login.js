const express = require("express");
const Login = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const DBQuery = require("../Database/Query_Builder");

//image upload functionality start
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upolads/products/");
  },
  filename: (req, file, cb) => {
    const fileext = path.extname(file.originalname);
    console.log(fileext);
    const filename =
      file.originalname.replace(fileext, "").toLowerCase() + "-" + Date.now();
    cb(null, filename + fileext);
  },
});
const upload = multer({
  //  limits: { fileSize: 2000000000 },
  fileFilter: (req, file, cb) => {
    console.log(req.file);
    if (file.fieldname == "img") {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only jpg,png,jpeg format are available"));
      }
    } else if (file.fieldname == "pdf") {
      console.log(file);
      if (
        file.mimetype == "application/pdf" ||
        file.mimetype ==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only pdf are available"));
      }
    } else {
      cb(new Error("unknown error"));
    }
  },
  storage: storage,
});
const uploadImage = upload.fields([{ name: "img", maxCount: 10 }]);

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

//login

Login.post("/login", async function (req, res, next) {
  const query = `SELECT*FROM customers WHERE email='${req.body.email}' `;
  const findUser = await DBQuery(query);
  console.log(findUser);
  try {
    if (findUser && findUser.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        findUser[0].password
      );
      console.log(isValidPassword);
      if (isValidPassword) {
        const token = jwt.sign(
          {
            name: findUser[0].name,
            Email: findUser[0].email,
          },
          process.env.JWT_TOKEN_SECRET,
          {
            expiresIn: 60000 * 30,
          }
        );
        res
          .status(200)
          // .cookie("access_token", "Bearer " + 778, {
          //   expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
          // })
          .json({
            success: true,
            access_token: token,
            message: "Login successfully",
            userdata: { email: findUser[0].email, name: findUser[0].name },
          });
      } else {
        res.status(200).json({
          Success1: true,
          message: "Authentication failed user password wrong",
        });
      }
    } else {
      res.status(200).json({
        Success1: true,
        message: "Authentication failed user not found",
      });
    }
  } catch {
    await res.status(401).json({
      error: "Authentication failed",
    });
  }
});

module.exports = Login;
