const express = require("express");
const Create_Route = express.Router();
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const DBQuery = require("../Database/Query_Builder");
//database
var a;
var b;
var c;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploadDoc/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });
// const uploadSingleImage = upload.array("documents");
// const uploadFile_books = upload.single("image");

Create_Route.post("/publisher", async function (req, res, next) {
  const query = `INSERT INTO  publishers(publisher_name) VALUES('${req.body.publisher_name}')`;
  const type = "insert";
  const result2 = await DBQuery(query, type);
  res.status(200).json({
    success: true,
  });
});

Create_Route.post("/category", async function (req, res, next) {
  const query = `INSERT INTO  categories(category_name) VALUES('${req.body.category_name}')`;
  const type = "insert";
  const result2 = await DBQuery(query, type);
  res.status(200).json({
    success: true,
  });
});
Create_Route.post("/book_add", async function (req, res, next) {
  const {
    entry_date,
    title,
    author,
    volume_edition,
    publication_date,
    source_date,
    desk_number,
    remark,
  } = req.body;
  const desk_floor = Number(req.body.desk_floor);
  const book_num = Number(req.body.book_num);
  const category_name = Number(req.body.category_name);
  const publisher_name = Number(req.body.publisher_name);
  const book_copy = Number(req.body.book_copy);

  const page_number = Number(req.body.page_number);
  console.log(req.body);
  // const cost = req.body.cost === "NaN" ? "" : Number(req.body.cost);
  // const call_no = req.body.call_no === "NaN" ? "" : Number(req.body.call_no);
  const cost =
    req.body.cost == "NaN"
      ? 0
      : req.body.cost == "null"
      ? 0
      : Number(req.body.cost);
  const call_no =
    req.body.call_no == "NaN"
      ? 0
      : req.body.call_no == "null"
      ? 0
      : Number(req.body.call_no);
  //check book num for unique
  const querycheck = `SELECT*FROM books where book_num=${book_num}`;
  const querycheck_result = await DBQuery(querycheck);

  if (
    querycheck_result.length > 0 &&
    querycheck_result[0].BOOK_NUM == book_num
  ) {
    res.status(200).json({
      success: "NotUnique",
      bookNum: book_num,
    });
  } else {
    const query = `INSERT INTO  books(category_id,
      publisher_id,entry_date,book_num,title,author,volume_edition,publication_date,page_number,cost,source_date,
      desk_number,desk_floor,number_of_copy,available_copy,call_no,remark) 
      VALUES('${category_name}','${publisher_name}','${entry_date}','${book_num}','${title}','${author}',
      '${volume_edition}','${publication_date}','${page_number}','${cost}','${source_date}','${desk_number}','${desk_floor}',
      '${book_copy}','${book_copy}','${call_no}','${remark}')`;
    const type = "insert";
    const result2 = await DBQuery(query, type);

    res.status(200).json({
      success: true,
    });
  }
});
// book add with image

Create_Route.post(
  "/book_add_withImage",
  upload.single("image"),
  async function (req, res, next) {
    // uploadFile_books(req, res, async function (err) {
    //   if (err) {
    //     console.log(err);
    //     return res.status(200).send({ status: 400, message: err.message });
    //   }
    const { filename: image } = req.file;
    const imageName =
      req.file.fieldname +
      "-" +
      Date.now() +
      path.extname(req.file.originalname);
    await sharp(req.file.path)
      .resize(150, 150)

      .jpeg({ quality: 90 })

      //.toFile(path.resolve(req.file.destination, "resized", image));
      .toFile(`./public/uploadDoc/${imageName}`);

    await fs.unlink(req.file.path, () => {
      // res.status(200).json({
      //   success: true,
      //   message: "Deleted data suceessfully",
      // });
    });
    // fs.unlink(req.file.path);

    const {
      entry_date,
      title,
      author,
      volume_edition,
      publication_date,
      source_date,
      desk_number,
      remark,
    } = req.body;
    const desk_floor = Number(req.body.desk_floor);
    const book_num = Number(req.body.book_num);
    const category_name = Number(req.body.category_name);
    const publisher_name = Number(req.body.publisher_name);
    const book_copy = Number(req.body.book_copy);

    const page_number = Number(req.body.page_number);

    const cost =
      req.body.cost == "NaN"
        ? 0
        : req.body.cost == "null"
        ? 0
        : Number(req.body.cost);
    const call_no =
      req.body.call_no == "NaN"
        ? 0
        : req.body.call_no == "null"
        ? 0
        : Number(req.body.call_no);
    //check unique book number
    console.log(req.body);
    console.log("cost", cost);
    console.log("call_no", call_no);
    const querycheck = `SELECT*FROM books where book_num=${book_num}`;
    const querycheck_result = await DBQuery(querycheck);

    if (
      querycheck_result.length > 0 &&
      querycheck_result[0].BOOK_NUM == book_num
    ) {
      res.status(200).json({
        success: "NotUnique",
        bookNum: book_num,
      });
    } else {
      const query = `INSERT INTO  books(category_id,
        publisher_id,entry_date,book_num,title,author,volume_edition,publication_date,page_number,cost,source_date,
        desk_number,desk_floor,number_of_copy,available_copy,call_no,remark,image)
        VALUES('${category_name}','${publisher_name}','${entry_date}','${book_num}','${title}','${author}',
        '${volume_edition}','${publication_date}','${page_number}','${cost}','${source_date}','${desk_number}','${desk_floor}',
        '${book_copy}','${book_copy}','${call_no}','${remark}','${imageName}')`;
      const type = "insert";
      const result2 = await DBQuery(query, type);
      res.status(200).json({
        success: true,
      });
    }

    // });
  }
);
Create_Route.post("/requestSend", async function (req, res, next) {
  const { bookNum, emplyee_id, request_date } = req.body;
  const checkQuery = `SELECT*FROM bookrent where status='Service on going' AND emp_id=${emplyee_id}`;
  const result = await DBQuery(checkQuery);
  const alreadyThisBookOnServce_Query = `SELECT*FROM bookrent where status='Service on going' AND emp_id=${emplyee_id} AND book_id=${bookNum}`;
  const Existresult = await DBQuery(alreadyThisBookOnServce_Query);
  const maxQuery = "SELECT*FROM booklimit";
  const Maxresult = await DBQuery(maxQuery);

  if (result.length > 0 && result.length + 1 > Maxresult[0].MAX_BOOK_LIMIT) {
    res.status(200).json({
      success1: "NotEligible",
    });
  } else if (Existresult.length > 0) {
    res.status(200).json({
      success2: "OnGoningAlready",
    });
  } else {
    const query = `INSERT INTO  sendrequest(emp_id,book_id,status,request_date) VALUES('${emplyee_id}','${bookNum}',0,'${request_date}')`;
    const type = "insert";
    const result2 = await DBQuery(query, type);
    res.status(200).json({
      success: true,
    });
  }
});
//AcceptbookIssue
Create_Route.post("/AcceptbookIssue", async function (req, res, next) {
  const { book_id, emp_id, issue_date, realse_date, request_date } = req.body;
  const query = `INSERT INTO  bookrent(BOOK_ID,EMP_ID,ISSUE_DATE,RELEASE_DATE,STATUS) VALUES('${book_id}','${emp_id}','${issue_date}','${realse_date}','Service on going')`;
  const type = "insert";
  const result2 = await DBQuery(query, type);
  if (result2) {
    const query23 = `SELECT*FROM books where book_num=${book_id}`;
    const result32 = await DBQuery(query23);
    const availabl = result32[0].AVAILABLE_COPY;
    const numberofcopy = result32[0].NUMBER_OF_COPY;

    if (availabl > 0 && numberofcopy >= availabl) {
      const new_available = availabl - 1;
      const query42 = `UPDATE books set AVAILABLE_COPY=${new_available} WHERE book_num=${book_id}`;
      const result321 = await DBQuery(query42);
      const query420 = `UPDATE sendrequest set status=3 WHERE book_id=${book_id} and emp_id=${emp_id} AND request_date='${request_date}'`;
      const result320 = await DBQuery(query420);
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(200).json({
        success1: true,
      });
    }
  }
});

Create_Route.post("/additionalTimeRequest", async function (req, res, next) {
  const { id, newrelease_date, prevous_release_date, request_date } = req.body;
  const query = `INSERT INTO bookrenew(bookrent_id,request_date,pre_release_date,new_release_date,status) VALUES('${id}','${request_date}','${prevous_release_date}','${newrelease_date}','${0}')`;
  const type = "insert";
  const result2 = await DBQuery(query, type);
  res.status(200).json({
    success: true,
  });
});
module.exports = Create_Route;
