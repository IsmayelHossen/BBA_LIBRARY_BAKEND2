const express = require("express");
const View_Route = express.Router();
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const DBQuery = require("../Database/Query_Builder");

// getpublisher
View_Route.get("/getpublisher", async function (req, res) {
  const query = `SELECT*from publishers`;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//getcategory
View_Route.get("/getcategory", async function (req, res) {
  const query = `SELECT*from categories`;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
View_Route.get("/getbooks", async function (req, res) {
  const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

View_Route.get("/getbookPendingRequest", async function (req, res) {
  const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=0
  `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//user
View_Route.get(
  "/getbookPendingRequest_user/:emp_id",
  async function (req, res) {
    const query = `SELECT sendrequest.*,books.*,categories.category_name,publishers.publisher_name,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where employees.id=${req.params.emp_id}
  `;
    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
//getbookAcceptRequest
View_Route.get("/getbookAcceptRequest", async function (req, res) {
  const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=1
  `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//geDeclnedBookRequest
View_Route.get("/geDeclinedBookRequest", async function (req, res) {
  const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=2
  `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

//getbookrentstatus
View_Route.get("/getbookrentstatus", async function (req, res) {
  const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id
  `;

  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
View_Route.get("/getbookpreviousstatus/:emp_id", async function (req, res) {
  const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id where employees.id=${req.params.emp_id}
  `;

  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//user dashboard
// gettotalbookUsed
View_Route.get("/gettotalbookUsed/:emp_id", async function (req, res) {
  const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id where employees.id=${req.params.emp_id}
  `;

  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//getemployee_previous_bookRecord
View_Route.get(
  "/getemployee_previous_bookRecord/:employee_id",
  async function (req, res) {
    const query = `SELECT*FROM bookrent where emp_id=${req.params.employee_id} `;
    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
//gettotalbookAccepptPending
View_Route.get(
  "/gettotalbookAccepptPending/:employee_id",
  async function (req, res) {
    const query = `SELECT*FROM sendrequest where emp_id=${req.params.employee_id} `;
    const result = await DBQuery(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
//admin  getPendingAcceptDeclinedData
View_Route.get("/getPendingAcceptDeclinedData", async function (req, res) {
  const query = `SELECT*FROM sendrequest `;
  const result = await DBQuery(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});
//gettotalbookissudForEmp
View_Route.get("/gettotalbookissudForEmp", async function (req, res) {
  const query = `SELECT*FROM bookrent `;
  const result = await DBQuery(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// getAdditionalTimerequest
View_Route.get("/getAdditionalTimerequest", async function (req, res) {
  const query = `SELECT distinct bookrent_id FROM bookrenew`;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//getAdditionalTimeRequestAll
View_Route.get("/getAdditionalTimeRequestAll", async function (req, res) {
  const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.*,bookrenew.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id 
  join bookrenew on bookrenew.bookrent_id=bookrent.id 
  `;
  const result = await DBQuery(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});
// getAdditionalTimeRequestSingle

View_Route.get(
  "/getAdditionalTimeRequestSingle/:bookrent_id",
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.*,bookrenew.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join employees on bookrent.emp_id=employees.id 
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join bookrenew on bookrenew.bookrent_id=bookrent.id where bookrent.id=${req.params.bookrent_id}
  `;
    const result = await DBQuery(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
// getdataToPrint booklist
View_Route.get("/getdataToPrint/:filterType", async function (req, res) {
  if (req.params.filterType == "all") {
    const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  `;
    const result = await DBQuery(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  }
  const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id where lower(categories.CATEGORY_NAME)='${req.params.filterType}' or lower(publishers.publisher_name)='${req.params.filterType}'
    `;
  const result = await DBQuery(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});
// getBookRequestPendingDataToPrint

View_Route.get(
  "/getBookRequestPendingDataToPrint/:report_type",
  async function (req, res) {
    const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=0
  `;
    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
//getBookRequestAcceptDataToPrint
View_Route.get(
  "/getBookRequestAcceptDataToPrint/:report_type",
  async function (req, res) {
    const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=1
  `;
    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
//getBookRentStatusDataToPrint
View_Route.get(
  "/getBookRentStatusDataToPrint/:report_type",
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id
  `;

    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
//getBookRenewStatusDataToPrint
View_Route.get(
  "/getBookRenewStatusDataToPrint/:report_type",
  async function (req, res) {
    const query = `SELECT books.*,categories.category_name,bookrenew.*,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id
  join bookrenew on bookrenew.bookrent_id=bookrent.id order by bookrenew.id asc
  `;

    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

//for update ..book data

View_Route.get("/getbookDataforUpdate/:id", async function (req, res) {
  const query = `SELECT categories.category_name,publishers.publisher_name,books.* from books
    join categories on categories.id=books.category_id
    join publishers on publishers.id=books.publisher_id where lower(books.book_num)='${req.params.id}'
      `;
  const result = await DBQuery(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});
//getEmployeeData
View_Route.get("/getEmployeeData", async function (req, res) {
  const query = `SELECT*from employees
      `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//getBookIndividualUserLibraryDataToPrint
View_Route.get(
  "/getBookIndividualUserLibraryDataToPrint/:type/:emp_id",
  async function (req, res) {
    const { type, emp_id } = req.params;
    if (type == 1) {
      const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=0 and employees.id=${emp_id}
  `;
      const result = await DBQuery(query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } else if (type == 2) {
      const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where sendrequest.status=1 and employees.id=${emp_id}
  `;
      const result = await DBQuery(query);
      res.status(200).json({
        success: true,
        data: result,
      });
    }
    //  else if(type==3){

    //  }
  }
);
module.exports = View_Route;
