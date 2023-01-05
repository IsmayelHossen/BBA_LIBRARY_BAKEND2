const express = require("express");
const Create_Route = express.Router();
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const DBQuery = require("../Database/Query_Builder");
const Connection = require("../Database/Connection");
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

Create_Route.post("/publisher", Connection, async function (req, res, next) {
  console.log(req.body);
  const publisher = req.body.publisher_name.replace(/'/g, "''");
  const query = `INSERT INTO  publishers(publisher_name) VALUES('${publisher}')`;
  try {
    let result = await req.Conn.execute(query);
    console.log(result);
    res.status(200).json({
      success: true,
      msg: "Publisher Added Successfully",
    });
    if (req.Conn) {
      // conn assignment worked, need to close
      console.log("close");
      await req.Conn.close();
    }
  } catch (errors) {
    console.log(errors);
    console.log("Query not executed");
  }
});

Create_Route.post("/category", Connection, async function (req, res, next) {
  const category_name = req.body.category_name.replace(/'/g, "''");
  const query = `INSERT INTO  categories(category_name) VALUES('${category_name}')`;
  try {
    let result = await req.Conn.execute(query);
    res.status(200).json({
      success: true,
      msg: "Category Added Successfully",
    });
    if (req.Conn) {
      await req.Conn.close();
    }
  } catch (errors) {
    console.log(errors);
    console.log("Query not executed");
  }
});
Create_Route.post("/book_add", Connection, async function (req, res, next) {
  const {
    entry_date,
    publication_date,
    desk_number,
    sequence_num,
    cost,
    old_book_num,
  } = req.body;
  const title = req.body.title.replace(/'/g, "''");
  const author = req.body.author.replace(/'/g, "''");
  const source_date = req.body.source_date.replace(/'/g, "''");
  const volume_edition = req.body.volume_edition.replace(/'/g, "''");
  const remark = req.body.remark.replace(/'/g, "''");
  const desk_floor = Number(req.body.desk_floor);
  const book_num = Number(req.body.book_num);
  const category_name = Number(req.body.category_name);
  const publisher_name = Number(req.body.publisher_name);
  const book_copy = Number(req.body.book_copy);

  const page_number = Number(req.body.page_number);
  console.log(req.body);

  const call_no =
    req.body.call_no == "NaN"
      ? 0
      : req.body.call_no == "null"
      ? 0
      : Number(req.body.call_no);
  //check book num for unique

  const querycheck = `SELECT*FROM books where book_num=${book_num}`;
  let result = await req.Conn.execute(querycheck);
  const querycheck_result = result.rows;

  if (
    querycheck_result.length > 0 &&
    querycheck_result[0].BOOK_NUM == book_num
  ) {
    res.status(200).json({
      success: "NotUnique",
      bookNum: book_num,
    });
    if (req.Conn) {
      await req.Conn.close();
    }
  } else {
    const query = `INSERT INTO  books(category_id,
      publisher_id,entry_date,book_num,title,author,volume_edition,publication_date,page_number,cost,source_date,
      desk_number,desk_floor,number_of_copy,available_copy,call_no,remark,seq_number,OLD_BOOK_NO) 
      VALUES('${category_name}','${publisher_name}','${entry_date}','${book_num}','${title}','${author}',
      '${volume_edition}','${publication_date}','${page_number}','${cost}','${source_date}','${desk_number}','${desk_floor}',
      '${book_copy}','${book_copy}','${call_no}','${remark}','${sequence_num}','${old_book_num}')`;
    try {
      let result = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        msg: "Book Added Successfully",
      });

      if (req.Conn) {
        await req.Conn.close();
      }
    } catch (errors) {
      console.log(errors);
      console.log("Query not executed");
      if (errors.errorNum == 1756) {
        res.status(200).json({
          success: false,
          msg: "Please insert proper value",
        });
        if (req.Conn) {
          await req.Conn.close();
        }
      }
    }
  }
});
// book add with image

Create_Route.post(
  "/book_add_withImage",
  upload.single("image"),
  Connection,
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
      publication_date,
      desk_number,
      sequence_num,
      cost,
      old_book_num,
    } = req.body;
    const title = req.body.title.replace(/'/g, "''");
    const author = req.body.author.replace(/'/g, "''");
    const source_date = req.body.source_date.replace(/'/g, "''");
    const volume_edition = req.body.volume_edition.replace(/'/g, "''");
    const remark = req.body.remark.replace(/'/g, "''");
    const desk_floor = Number(req.body.desk_floor);
    const book_num = Number(req.body.book_num);
    const category_name = Number(req.body.category_name);
    const publisher_name = Number(req.body.publisher_name);
    const book_copy = Number(req.body.book_copy);

    const page_number = Number(req.body.page_number);

    // const cost =
    //   req.body.cost == "NaN"
    //     ? 0
    //     : req.body.cost == "null"
    //     ? 0
    //     : Number(req.body.cost);
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
    let result = await req.Conn.execute(querycheck);
    const querycheck_result = result.rows;

    if (
      querycheck_result.length > 0 &&
      querycheck_result[0].BOOK_NUM == book_num
    ) {
      res.status(200).json({
        success: "NotUnique",
        bookNum: book_num,
      });
      if (req.Conn) {
        await req.Conn.close();
      }
    } else {
      const query = `INSERT INTO  books(category_id,
        publisher_id,entry_date,book_num,title,author,volume_edition,publication_date,page_number,cost,source_date,
        desk_number,desk_floor,number_of_copy,available_copy,call_no,remark,image,seq_number,OLD_BOOK_NO)
        VALUES('${category_name}','${publisher_name}','${entry_date}','${book_num}','${title}','${author}',
        '${volume_edition}','${publication_date}','${page_number}','${cost}','${source_date}','${desk_number}','${desk_floor}',
        '${book_copy}','${book_copy}','${call_no}','${remark}','${imageName}','${sequence_num}','${old_book_num}')`;
      try {
        let result = await req.Conn.execute(query);
        res.status(200).json({
          success: true,
          msg: "Book Added Successfully",
        });

        if (req.Conn) {
          await req.Conn.close();
        }
      } catch (errors) {
        console.log(errors);
        console.log("Query not executed");
        if (errors.errorNum == 1756) {
          res.status(200).json({
            success: false,
            msg: "Please insert proper value",
          });
        }
        if (req.Conn) {
          await req.Conn.close();
        }
      }
    }

    // });
  }
);
Create_Route.post("/requestSend", Connection, async function (req, res, next) {
  const { bookNum, emplyee_id, request_date, otp } = req.body;
  const checkQuery = `SELECT*FROM bookrent where status='Service on going' AND emp_id=${emplyee_id}`;
  let querycheck_result = await req.Conn.execute(checkQuery);
  const result = querycheck_result.rows;

  const alreadyThisBookOnServce_Query = `SELECT*FROM bookrent where status='Service on going' AND emp_id=${emplyee_id} AND book_id=${bookNum}`;
  let Execute = await req.Conn.execute(alreadyThisBookOnServce_Query);
  const Existresult = Execute.rows;
  const maxQuery = "SELECT*FROM booklimit";
  let Execute2 = await req.Conn.execute(maxQuery);
  const Maxresult = Execute2.rows;
  if (
    result.length > 0 &&
    Maxresult.length &&
    result.length + 1 > Maxresult[0].MAX_BOOK_LIMIT
  ) {
    res.status(200).json({
      success1: "NotEligible",
    });
    if (req.Conn) {
      await req.Conn.close();
    }
  } else if (Existresult.length > 0) {
    res.status(200).json({
      success2: "OnGoningAlready",
    });
    if (req.Conn) {
      console.log("close");
      await req.Conn.close();
    }
  } else {
    const query = `INSERT INTO  sendrequest(emp_id,book_id,status,request_date,otp) VALUES('${emplyee_id}','${bookNum}',0,'${request_date}','${otp}')`;
    try {
      let result = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        msg: "Book Request Sent Successfully",
      });
      if (req.Conn) {
        await req.Conn.close();
      }
    } catch (errors) {
      console.log(errors);
      console.log("Query not executed");
    }
  }
});
//AcceptbookIssue
Create_Route.post(
  "/AcceptbookIssue",
  Connection,
  async function (req, res, next) {
    const {
      book_id,
      emp_id,
      issue_date,
      realse_date,
      request_date,
      old_book_no,
    } = req.body;
    const query = `INSERT INTO  bookrent(BOOK_ID,EMP_ID,ISSUE_DATE,RELEASE_DATE,STATUS,OLD_BOOK_NO) VALUES('${book_id}','${emp_id}','${issue_date}','${realse_date}','Service on going','${old_book_no}')`;

    try {
      let result2 = await req.Conn.execute(query);

      if (result2.rowsAffected) {
        const query23 = `SELECT*FROM books where book_num=${book_id}`;
        let execute = await req.Conn.execute(query23);
        const result32 = execute.rows;
        const availabl = result32[0].AVAILABLE_COPY;
        const numberofcopy = result32[0].NUMBER_OF_COPY;

        if (availabl > 0 && numberofcopy >= availabl) {
          const new_available = availabl - 1;
          const query42 = `UPDATE books set AVAILABLE_COPY=${new_available} WHERE book_num=${book_id}`;
          const result321 = await req.Conn.execute(query42);
          const query420 = `UPDATE sendrequest set status=3 WHERE book_id=${book_id} and emp_id=${emp_id} AND request_date='${request_date}'`;
          const result320 = await req.Conn.execute(query420);
          res.status(200).json({
            success: true,
            msg: "Book Issued Successfully",
          });
          if (req.Conn) {
            await req.Conn.close();
          }
        } else {
          res.status(200).json({
            success1: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

Create_Route.post(
  "/additionalTimeRequest",
  Connection,
  async function (req, res, next) {
    const { id, newrelease_date, prevous_release_date, request_date } =
      req.body;
    const query = `INSERT INTO bookrenew(bookrent_id,request_date,pre_release_date,new_release_date,status) VALUES('${id}','${request_date}','${prevous_release_date}','${newrelease_date}','${0}')`;
    try {
      let result = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        msg: "Book Renew Request Sent Successfully",
      });
      if (req.Conn) {
        // conn assignment worked, need to close
        console.log("close");
        await req.Conn.close();
      }
    } catch (errors) {
      console.log(errors);
      console.log("Query not executed");
    }
  }
);
module.exports = Create_Route;
