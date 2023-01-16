const oracledb = require("oracledb");

const Connection = async (req, res, next) => {
  try {
    req.Conn = await oracledb.getConnection({
      // user: "LIBMODULE",
      // password: "Libmodule123",
      // connectString: "192.168.3.8/orclpdb",
      user: "system",
      password: "system123",
      connectString: "localhost/orcl",
    });

    next();
  } catch (error) {
    console.log(error);
    next("Connection Problem");
  }
};
module.exports = Connection;
