const oracledb = require("oracledb");
const DBQuery = async function db_query(query, type) {
  let connection = undefined;
  if (connection == undefined) {
    connection = await oracledb.getConnection({
      // user: "LIBMODULE",
      // password: "Libmodule123",
      // connectString: "192.168.3.8/orclpdb",
      user: "system",
      password: "system123",
      connectString: "localhost/orcl",
    });
  }
  try {
    let result = await connection.execute(query);
    if (type == "insert") {
      return result.rowsAffected;
    }
    return result.rows;
  } catch (errors) {
    console.log(errors);
    console.log("Query not executed");
    return errors.errorNum;
  }
};

module.exports = DBQuery;
