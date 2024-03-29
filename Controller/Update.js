const express = require("express");
const Update_Route = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");

const DBQuery = require("../Database/Query_Builder");
const Connection = require("../Database/Connection");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploadDoc/");
  },

  filename: (req, file, cb) => {
    const fileext = path.extname(file.originalname);
    const filename =
      file.originalname.replace(fileext, "_").toLowerCase() +
      new Date().getTime();
    cb(null, filename + fileext);
  },
});

var upload = multer({ storage: storage });
// const uploadSingleImage = upload.array("documents");
const uploadFile_books = upload.single("image");

Update_Route.put("/publisher/:id", Connection, async function (req, res) {
  const id = req.params.id;
  const publisher_name = req.body.publisher_name.replace(/'/g, "''");
  const query = `UPDATE publishers SET publisher_name='${publisher_name}' WHERE ID=${id} `;
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
//smsSettings
Update_Route.put("/smsSettings/:id", Connection, async function (req, res) {
  const id = req.params.id;
  const {
    USER_REQUESTSMS,
    LIB_GETREQUESTSMS,
    USER_REQUESTACCEPTSMS,
    USER_BOOKRETURNSMS,
  } = req.body;
  const query = `UPDATE library_sms SET USER_REQUESTSMS='${USER_REQUESTSMS}',LIB_GETREQUESTSMS='${LIB_GETREQUESTSMS}',USER_REQUESTACCEPTSMS='${USER_REQUESTACCEPTSMS}',
  USER_BOOKRETURNSMS='${USER_BOOKRETURNSMS}' WHERE ID=${id} `;
  let result = await req.Conn.execute(query);

  res.status(200).json({
    success: true,
    data: result.rows,
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
// maxbooklimit
Update_Route.put("/maxbooklimit/:id", Connection, async function (req, res) {
  const id = req.params.id;
  const { MAX_BOOK_LIMIT } = req.body;
  const query = `UPDATE booklimit SET MAX_BOOK_LIMIT='${MAX_BOOK_LIMIT}' WHERE ID=${id} `;
  let result = await req.Conn.execute(query);

  res.status(200).json({
    success: true,
    data: result.rows,
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});

Update_Route.put("/category/:id", Connection, async function (req, res) {
  const id = req.params.id;
  const category_name = req.body.category_name.replace(/'/g, "''");
  const query = `UPDATE categories SET category_name='${category_name}' WHERE ID=${id} `;
  let result = await req.Conn.execute(query);

  res.status(200).json({
    success: true,
    data: result.rows,
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
//sentrequest_reply
Update_Route.put(
  "/sentrequest_reply/:emp_id",
  Connection,
  async function (req, res) {
    const emp_id = req.params.emp_id;
    const { book_id, request_date, declined, request_status, id } = req.body;
    const query = `UPDATE sendrequest SET status='${request_status}',DECLINED_MSG='${declined}' WHERE  book_id=${book_id}
  AND emp_id='${emp_id}' AND REQUEST_DATE='${request_date}' AND id='${id}' `;
    let result = await req.Conn.execute(query);
    res.status(200).json({
      success: true,
      data: result.rows,
    });
    if (req.Conn) {
      await req.Conn.close();
    }
  }
);
//IssuebookReturn
Update_Route.put(
  "/IssuebookReturn/:rent_id",
  Connection,
  async function (req, res) {
    const rent_id = req.params.rent_id;
    console.log(rent_id);
    console.log(req.body);
    const { book_id, receive_date, remark } = req.body;
    const query = `UPDATE bookrent SET RECEIVE_DATE='${receive_date}',status='Release',remark1='${remark}' WHERE ID='${rent_id}' `;

    try {
      let result = await req.Conn.execute(query);

      if (result.rowsAffected) {
        console.log(result.rowsAffected);
        const query2 = `select*from books where book_num=${book_id}`;
        let execute = await req.Conn.execute(query2);
        const result2 = execute.rows;

        var new_available = result2[0].AVAILABLE_COPY + 1;

        const query3 = `update books set AVAILABLE_COPY=${new_available} WHERE  book_num=${book_id}`;
        let result3 = await req.Conn.execute(query3);
        console.log("put");
        res.status(200).json({
          success: true,
          data: result3,
          msg: "Data Updated",
        });
      }
      if (req.Conn) {
        await req.Conn.close();
      }
    } catch (errors) {
      console.log(errors);
      console.log("Query not executed");
    }
  }
);
//IssuebookRenew
Update_Route.put("/IssuebookRenew/:id", Connection, async function (req, res) {
  const id = req.params.id;
  const {
    previous_release_date,
    new_release_date,
    request_status,
    dclined,
    bookrent_id,
  } = req.body;
  if (request_status == 1) {
    try {
      const query = `UPDATE bookrenew SET NEW_RELEASE_DATE='${new_release_date}',status='${request_status}' WHERE  id=${id} `;
      let result = await req.Conn.execute(query);
      if (result.rowsAffected) {
        const query3 = `update bookrent set release_date='${new_release_date}' WHERE  id='${bookrent_id}'`;
        let result3 = await req.Conn.execute(query3);
        res.status(200).json({
          success: true,
          data: result3,
          msg: "Issue Book Renew Successfully",
        });
        if (req.Conn) {
          await req.Conn.close();
        }
      }
    } catch (errors) {
      console.log(errors);
      console.log("Query not executed");
    }
  } else {
    const query = `UPDATE bookrenew SET NEW_RELEASE_DATE='${new_release_date}',status='${request_status}',remark3='${dclined}' WHERE  id=${id} `;
    try {
      let result3 = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        data: result3,
        msg: "Issue Book Renew Successfully",
      });
      if (req.Conn) {
        await req.Conn.close();
      }
    } catch (error) {
      console.log(error);
      console.log("Query not executed");
    }
  }
});

// Updatebook_withImage

Update_Route.put(
  "/Updatebook_withImage/:id/:delete_image",
  Connection,
  async function (req, res) {
    uploadFile_books(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res.status(200).send({ status: 400, message: err.message });
      }
      const { id, delete_image } = req.params;
      const { filename: image } = req.file;
      const imageName = req.file.filename;
      console.log(req.file);

      const {
        ENTRY_DATE,
        PUBLICATION_DATE,
        DESK_NUMBER,
        DESK_FLOOR,
        SEQ_NUMBER,
        COST,
        OLD_BOOK_NO,
      } = req.body;

      const TITLE =
        req.body.TITLE != null
          ? req.body.TITLE.replace(/'/g, "''")
          : req.body.TITLE;
      const AUTHOR =
        req.body.AUTHOR != null
          ? req.body.AUTHOR.replace(/'/g, "''")
          : req.body.AUTHOR;
      const SOURCE_DATE =
        req.body.SOURCE_DATE != null
          ? req.body.SOURCE_DATE.replace(/'/g, "''")
          : req.body.SOURCE_DATE;
      const VOLUME_EDITION =
        req.body.VOLUME_EDITION != null
          ? req.body.VOLUME_EDITION.replace(/'/g, "''")
          : req.body.VOLUME_EDITION;
      const REMARK =
        req.body.REMARK != null
          ? req.body.REMARK.replace(/'/g, "''")
          : req.body.REMARK;
      const desk_floor = Number(req.body.DESK_FLOOR);
      const book_num = Number(req.body.BOOK_NUM);
      const CATEGORY_ID = Number(req.body.CATEGORY_ID);
      const PUBLISHER_ID = Number(req.body.PUBLISHER_ID);
      const NUMBER_OF_COPY = Number(req.body.NUMBER_OF_COPY);
      const AVAILABLE_COPY = Number(req.body.AVAILABLE_COPY);

      const PAGE_NUMBER = Number(req.body.PAGE_NUMBER);

      const CALL_NO =
        req.body.CALL_NO == "NaN"
          ? 0
          : req.body.CALL_NO == "null"
          ? 0
          : Number(req.body.CALL_NO);
      // const imagename = req.files[0].filename;
      const query = `UPDATE books SET CALL_NO='${CALL_NO}',COST='${COST}', CATEGORY_ID='${CATEGORY_ID}',PUBLISHER_ID='${PUBLISHER_ID}',NUMBER_OF_COPY='${NUMBER_OF_COPY}'
  ,PAGE_NUMBER='${PAGE_NUMBER}', AUTHOR='${AUTHOR}',DESK_NUMBER='${DESK_NUMBER}',DESK_FLOOR=${desk_floor}
   , book_num=${book_num},title='${TITLE}',VOLUME_EDITION='${VOLUME_EDITION}',REMARK='${REMARK}',SOURCE_DATE='${SOURCE_DATE}',PUBLICATION_DATE='${PUBLICATION_DATE}',entry_date='${ENTRY_DATE}',
   image='${imageName}',seq_number='${SEQ_NUMBER}',OLD_BOOK_NO='${OLD_BOOK_NO}'  where id=${id} `;
      try {
        let result3 = await req.Conn.execute(query);

        if (req.Conn) {
          console.log("book with image");
          await req.Conn.close();
        }
      } catch (error) {
        console.log(error);
        console.log("Query not executed");
      }
      if (delete_image != null) {
        const filepath = `public/uploadDoc/${delete_image}`;
        await fs.unlink(filepath, () => {
          res.status(200).json({
            success: true,
            message: "Deleted data suceessfully",
          });
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Deleted data suceessfully",
        });
      }
    });
  }
);
//update book without image
Update_Route.put("/bookUpdate/:id", Connection, async function (req, res) {
  // const id = req.params.id;

  const { id } = req.params;

  const {
    ENTRY_DATE,
    PUBLICATION_DATE,
    DESK_NUMBER,
    SEQ_NUMBER,
    COST,
    OLD_BOOK_NO,
  } = req.body;
  const TITLE =
    req.body.TITLE != null
      ? req.body.TITLE.replace(/'/g, "''")
      : req.body.TITLE;
  const AUTHOR =
    req.body.AUTHOR != null
      ? req.body.AUTHOR.replace(/'/g, "''")
      : req.body.AUTHOR;
  const SOURCE_DATE =
    req.body.SOURCE_DATE != null
      ? req.body.SOURCE_DATE.replace(/'/g, "''")
      : req.body.SOURCE_DATE;
  const VOLUME_EDITION =
    req.body.VOLUME_EDITION != null
      ? req.body.VOLUME_EDITION.replace(/'/g, "''")
      : req.body.VOLUME_EDITION;
  const REMARK =
    req.body.REMARK != null
      ? req.body.REMARK.replace(/'/g, "''")
      : req.body.REMARK;

  const desk_floor = Number(req.body.DESK_FLOOR);
  const book_num = Number(req.body.BOOK_NUM);
  const CATEGORY_ID = Number(req.body.CATEGORY_ID);
  const PUBLISHER_ID = Number(req.body.PUBLISHER_ID);
  const NUMBER_OF_COPY = Number(req.body.NUMBER_OF_COPY);
  const AVAILABLE_COPY = Number(req.body.AVAILABLE_COPY);

  const PAGE_NUMBER = Number(req.body.PAGE_NUMBER);

  // const COST =
  //   req.body.COST == "NaN"
  //     ? 0
  //     : req.body.COST == "null"
  //     ? 0
  //     : Number(req.body.COST);
  const CALL_NO =
    req.body.CALL_NO == "NaN"
      ? 0
      : req.body.CALL_NO == "null"
      ? 0
      : Number(req.body.CALL_NO);

  const query = `UPDATE books SET CALL_NO='${CALL_NO}',COST='${COST}', CATEGORY_ID='${CATEGORY_ID}',PUBLISHER_ID='${PUBLISHER_ID}',NUMBER_OF_COPY='${NUMBER_OF_COPY}',
  AVAILABLE_COPY='${AVAILABLE_COPY}',PAGE_NUMBER='${PAGE_NUMBER}', AUTHOR='${AUTHOR}',DESK_NUMBER='${DESK_NUMBER}',DESK_FLOOR='${desk_floor}'
   , book_num='${book_num}',title='${TITLE}',VOLUME_EDITION='${VOLUME_EDITION}',REMARK='${REMARK}',SOURCE_DATE='${SOURCE_DATE}',PUBLICATION_DATE='${PUBLICATION_DATE}',entry_date='${ENTRY_DATE}'
   ,seq_number='${SEQ_NUMBER}',OLD_BOOK_NO='${OLD_BOOK_NO}' where id=${id} `;
  try {
    let result3 = await req.Conn.execute(query);

    if (req.Conn) {
      await req.Conn.close();
      console.log("book update");
    }
  } catch (error) {
    console.log(error);
    console.log("Query not executed");
  }

  res.status(200).json({
    success: true,
  });
});
module.exports = Update_Route;
