const express = require("express");
const Delete_Route = express.Router();
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { log } = require("console");
//database
const DBQuery = require("../Database/Query_Builder");

// Delete_Route.delete("/delete/docs/:id/:filename", async function (req, res) {
//   const id = req.params.id;
//   console.log(id);
//   const query = `delete from fileupload where id='${id}'`;
//   const result1 = await DBQuery(query);

//   const filepath = `public/uploadDoc/${req.params.filename}`;

//   await fs.unlink(filepath, () => {
//     res.status(200).json({
//       success: true,
//       message: "Deleted data suceessfully",
//     });
//   });
// });

// Delete_Route.delete("/delete/:id", async function (req, res) {
//   const id = req.params.id;
//   console.log({ id });
//   const allfilename = `select*from fileupload where documents_id=${id}`;
//   const allfilename1 = await DBQuery(allfilename);

//   allfilename1.map(async (row, index) => {
//     const filepath = `public/uploadDoc/${row.FILENAME}`;
//     await fs.unlink(filepath, () => {});
//   });

//   const query1 = `delete from fileupload where documents_id=${id}`;
//   const result1 = await DBQuery(query1);

//   const query2 = `delete from documents where ID='${id}' `;
//   const result2 = await DBQuery(query2);
//   res.status(200).json({
//     success: true,
//     data: result2,
//   });
// });
//category delete

Delete_Route.delete("/publisher/:id", async function (req, res) {
  const id = req.params.id;
  console.log(id);
  const query = `delete from publishers where id='${id}'`;
  const result1 = await DBQuery(query);
  res.status(200).json({
    success: true,
    message: "Deleted data suceessfully",
  });
});

Delete_Route.delete("/category/:id", async function (req, res) {
  const id = req.params.id;
  console.log(id);
  const query = `delete from categories where id='${id}'`;
  const result1 = await DBQuery(query);
  res.status(200).json({
    success: true,
    message: "Deleted data suceessfully",
  });
});
Delete_Route.delete("/book/:book_num/:imagename", async function (req, res) {
  const book_num = req.params.book_num;
  console.log(book_num);
  const query = `delete from books where book_num='${book_num}'`;
  const result1 = await DBQuery(query);
  if (result1 == 2292) {
    res.status(200).json({
      childDataFoundError: true,
      message: "At first delete child record",
    });
  } else {
    const filepath = `public/uploadDoc/${req.params.imagename}`;
    await fs.unlink(filepath, () => {
      res.status(200).json({
        success: true,
        message: "Deleted data suceessfully",
      });
    });
  }
});
module.exports = Delete_Route;
