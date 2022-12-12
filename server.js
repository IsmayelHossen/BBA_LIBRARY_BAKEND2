var express = require("express");
var fileUpload = require("express-fileupload");
var app = express();
const mysql = require("mysql");
const port = 4123;
const cors = require("cors");
const oracledb = require("oracledb");
const Query_Builder = require("./Query_Builder");
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OBJECT;
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use(fileUpload());

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });

    const file = req.files.file;
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
      if (err) {
        console.error(err);

        return res.status(500).send(errr);
      }

      res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port' ${port}`);
});
