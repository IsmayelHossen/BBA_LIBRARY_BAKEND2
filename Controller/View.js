const express = require("express");
const oracledb = require("oracledb");
const View_Route = express.Router();
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const DBQuery = require("../Database/Query_Builder");
const Connection = require("../Database/Connection");

// getpublisher
View_Route.get("/getpublisher", Connection, async function (req, res, next) {
  const query = `SELECT*from publishers order by id desc`;
  // const result = await DBQuery(query);
  try {
    let result = await req.Conn.execute(query);
    res.status(200).json({
      success: true,
      data: result.rows,
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
//getcategory
View_Route.get("/getcategory", Connection, async function (req, res) {
  const query = `SELECT*from categories order by id desc`;
  // const result = await DBQuery(query);
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
    msg: "Category data",
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
View_Route.get("/getbooks", Connection, async function (req, res) {
  const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id order by book_num desc
  `;
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
    msg: "Books data",
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});

View_Route.get("/getbookPendingRequest", Connection, async function (req, res) {
  const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=0 order by sendrequest.id desc
  `;

  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
    msg: "Pending request data",
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
//user
View_Route.get(
  "/getbookPendingRequest_user/:emp_id",
  Connection,
  async function (req, res) {
    const query = `SELECT sendrequest.*,books.*,categories.category_name,publishers.publisher_name,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where employees.id=${req.params.emp_id} order by sendrequest.id desc
  `;
    let result = await req.Conn.execute(query);
    res.status(200).json({
      success: true,
      data: result.rows,
      msg: "User Pending Request Data",
    });
    if (req.Conn) {
      await req.Conn.close();
    }
  }
);
//getbookAcceptRequest
View_Route.get("/getbookAcceptRequest", Connection, async function (req, res) {
  const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=1 order by sendrequest.id desc
  `;
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
    msg: "Accepted Book Request Data",
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
//geDeclnedBookRequest

View_Route.get("/geDeclinedBookRequest", Connection, async function (req, res) {
  const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=2 order by sendrequest.id desc
  
  `;
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
    msg: " Request Declined Data",
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});

//getbookrentstatus
View_Route.get("/getbookrentstatus", Connection, async function (req, res) {
  const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id order by bookrent.id desc
  `;

  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
    msg: "Book Rent Data",
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
View_Route.get(
  "/getbookpreviousstatus/:emp_id",
  Connection,
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id where employees.id=${req.params.emp_id}  order by bookrent.id desc
  `;

    let result = await req.Conn.execute(query);
    res.status(200).json({
      success: true,
      data: result.rows,
      msg: "User Previous Records",
    });
    if (req.Conn) {
      await req.Conn.close();
    }
  }
);
//user dashboard
// gettotalbookUsed
View_Route.get(
  "/gettotalbookUsed/:emp_id",
  Connection,
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id where employees.id=${req.params.emp_id}  order by bookrent.id desc
  `;

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
//getemployee_previous_bookRecord
View_Route.get(
  "/getemployee_previous_bookRecord/:employee_id",
  Connection,
  async function (req, res) {
    const query = `SELECT*FROM bookrent where emp_id=${req.params.employee_id}  order by bookrent.id desc `;
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
//gettotalbookAccepptPending
View_Route.get(
  "/gettotalbookAccepptPending/:employee_id",
  Connection,
  async function (req, res) {
    const query = `SELECT*FROM sendrequest where emp_id=${req.params.employee_id}  order by id desc`;
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
//admin  getPendingAcceptDeclinedData
View_Route.get(
  "/getPendingAcceptDeclinedData",
  Connection,
  async function (req, res) {
    const query = `SELECT*FROM sendrequest  order by id desc `;
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
//gettotalbookissudForEmp
View_Route.get(
  "/gettotalbookissudForEmp",
  Connection,
  async function (req, res) {
    const query = `SELECT*FROM bookrent  order by id desc `;
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

// getAdditionalTimerequest
View_Route.get(
  "/getAdditionalTimerequest",
  Connection,
  async function (req, res) {
    const query = `SELECT distinct bookrent_id FROM bookrenew  order by id desc`;
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
//getAdditionalTimeRequestAll
View_Route.get(
  "/getAdditionalTimeRequestAll",
  Connection,
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.*,bookrenew.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id 
  join bookrenew on bookrenew.bookrent_id=bookrent.id  order by bookrenew.id desc
  `;
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
// getAdditionalTimeRequestSingle

View_Route.get(
  "/getAdditionalTimeRequestSingle/:bookrent_id",
  Connection,
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.*,bookrenew.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join employees on bookrent.emp_id=employees.id 
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join bookrenew on bookrenew.bookrent_id=bookrent.id where bookrent.id=${req.params.bookrent_id} order by bookrenew.id desc
  `;
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
// getdataToPrint booklist
View_Route.get(
  "/getdataToPrint/:filterType",
  Connection,
  async function (req, res) {
    if (req.params.filterType == "all") {
      const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id order by books.book_num asc
  `;
      let result = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        data: result.rows,
      });
      if (req.Conn) {
        await req.Conn.close();
      }
    } else {
      const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
    join categories on categories.id=books.category_id
    join publishers on publishers.id=books.publisher_id where lower(categories.CATEGORY_NAME)='${req.params.filterType}' or lower(publishers.publisher_name)='${req.params.filterType}'
    order by books.id asc `;
      let result = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        data: result.rows,
      });
      if (req.Conn) {
        await req.Conn.close();
      }
    }
  }
);
// getBookRequestPendingDataToPrint

View_Route.get(
  "/getBookRequestPendingDataToPrint/:report_type",
  Connection,
  async function (req, res) {
    const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=0 order by sendrequest.id desc
  `;
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
//getBookRequestAcceptDataToPrint
View_Route.get(
  "/getBookRequestAcceptDataToPrint/:report_type",
  Connection,
  async function (req, res) {
    const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=1 order by sendrequest.id desc
  `;
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
//getBookRentStatusDataToPrint
View_Route.get(
  "/getBookRentStatusDataToPrint/:report_type",
  Connection,
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id order by bookrent.id asc
  `;

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
//getBookRenewStatusDataToPrint
View_Route.get(
  "/getBookRenewStatusDataToPrint/:report_type",
  Connection,
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,bookrenew.*,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id
  join bookrenew on bookrenew.bookrent_id=bookrent.id order by bookrenew.id asc
  `;

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

//for update ..book data

View_Route.get(
  "/getbookDataforUpdate/:id",
  Connection,
  async function (req, res) {
    const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
    join categories on categories.id=books.category_id
    join publishers on publishers.id=books.publisher_id where lower(books.book_num)='${req.params.id}'
      `;
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
//getEmployeeData
View_Route.get("/getEmployeeData", Connection, async function (req, res) {
  const query = `SELECT*from employees
      `;
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
//getBookIndividualUserLibraryDataToPrint(pending,accept)
View_Route.get(
  "/getBookIndividualUserLibraryDataToPrint/:type/:emp_id",
  Connection,
  async function (req, res) {
    const { type, emp_id } = req.params;
    if (type == 1) {
      const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=0 and employees.id=${emp_id}
  `;
      let result = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        data: result.rows,
      });
      if (req.Conn) {
        await req.Conn.close();
      }
    } else if (type == 2) {
      const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=1 and employees.id=${emp_id}
  `;
      let result = await req.Conn.execute(query);
      res.status(200).json({
        success: true,
        data: result.rows,
      });
      if (req.Conn) {
        await req.Conn.close();
      }
    }
    //  else if(type==3){

    //  }
  }
);
// getBookIndividualUserRentDataToPrint
View_Route.get(
  "/getBookIndividualUserRentDataToPrint/:type/:emp_id",
  Connection,
  async function (req, res) {
    const { type, emp_id } = req.params;
    console.log(emp_id);
    const query = `SELECT bookrent.*,categories.category_name,publishers.publisher_name,books.*,employees.* from bookrent 
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id= employees.id
   where employees.id=${emp_id}
  `;
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
//getBookIndividualUserRenewDataToPrint
View_Route.get(
  "/getBookIndividualUserRenewDataToPrint/:type/:emp_id",
  Connection,
  async function (req, res) {
    const { type, emp_id } = req.params;

    const query = `SELECT books.*,categories.category_name,bookrenew.*,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id
  join bookrenew on bookrenew.bookrent_id=bookrent.id where employees.id=${emp_id}
  `;
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
//get user renew satus
View_Route.get(
  "/getbookrenewstatus/:emp_id",
  Connection,
  async function (req, res) {
    const { emp_id } = req.params;

    const query = `SELECT books.*,categories.category_name,bookrenew.*,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id
  join bookrenew on bookrenew.bookrent_id=bookrent.id where employees.id=${emp_id}  AND bookrent.status='Service on going' order by bookrenew.id ASC
  `;
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

//getBookCopy_onserviceing
View_Route.get(
  "/getBookCopy_onserviceing/:book_id",
  Connection,
  async function (req, res) {
    const { book_id } = req.params;
    const query = `Select*from bookrent where book_id='${book_id}' AND status='Service on going' `;
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
//getSmsSettingsData
View_Route.get("/getSmsSettingsData/", Connection, async function (req, res) {
  const { book_id } = req.params;
  const query = `Select*from library_sms `;
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});
//maxbooklimit
View_Route.get("/maxbooklimit/", Connection, async function (req, res) {
  const { book_id } = req.params;
  const query = `Select*from booklimit `;
  let result = await req.Conn.execute(query);
  res.status(200).json({
    success: true,
    data: result.rows,
  });
  if (req.Conn) {
    await req.Conn.close();
  }
});

module.exports = View_Route;
