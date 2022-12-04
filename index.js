var express = require("express");
var app = express();

const port = 4123;
const cors = require("cors");
const oracledb = require("oracledb");
const Search_Route = require("./Controller/Search");
const View_Route = require("./Controller/View");
const Create_Route = require("./Controller/Create");
const Delete_Route = require("./Controller/Delete");
const Update_Route = require("./Controller/Update");
const Login_Route = require("./Controller/Login");
const routes = express.Router({});
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OBJECT;
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.static("public"));
app.use(routes);

app.use("/library/search/", Search_Route);
app.use("/library/view/", View_Route);
app.use("/library/create/", Create_Route);
app.use("/library/delete/", Delete_Route);
app.use("/library/update/", Update_Route);
app.use("/library", Login_Route);

app.listen(port, () => {
  console.log(`Example app listening on port' ${port}`);
});
