const express = require("express");
const Search_Route = express.Router();
const path = require("path");
const multer = require("multer");
const DBQuery = require("../Database/Query_Builder");

Search_Route.get("/publisher/:search", async function (req, res) {
  const s = req.params;
  const query = `SELECT*FROM publishers where lower(publisher_name) like '%${s.search}%' `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
Search_Route.get("/category/:search", async function (req, res) {
  const s = req.params;
  const query = `SELECT*FROM categories where lower(category_name) like '%${s.search}%' `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//book request status rent admin
Search_Route.get("/bookrentStatus_admin/:search", async function (req, res) {
  const search = req.params.search;
  const query = ` 
  SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id where lower(categories.category_name) like '%${search}%' OR lower(publishers.publisher_name) like '%${search}%' OR bookrent.old_book_no like '%${search}%' OR books.book_num like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(bookrent.status) like '%${search}%' OR lower(employees.name) like '%${search}%' 
 
  `;

  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//book renew status renew admin
Search_Route.get("/bookrenewStatus_admin/:search", async function (req, res) {
  const search = req.params.search;
  const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.*,bookrenew.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id 
  join bookrenew on bookrenew.bookrent_id=bookrent.id  where lower(categories.category_name) like '%${search}%' OR lower(publishers.publisher_name) like '%${search}%' OR books.book_num like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(bookrent.old_book_no) like '%${search}%' OR lower(employees.name) like '%${search}%' 
  `;

  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
Search_Route.get("/BookDeclinedData/:search", async function (req, res) {
  const search = req.params.search;
  const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id  where (lower(categories.category_name) like '%${search}%' OR lower(publishers.publisher_name) like '%${search}%' OR books.book_num like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(books.author) like '%${search}%'  OR lower(employees.name) like '%${search}%') AND sendrequest.status=2 
  `;

  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

Search_Route.get(
  "/bookrequeststatus_user/:search/:emp_id",
  async function (req, res) {
    const search = req.params.search;
    const query = `SELECT sendrequest.*,categories.category_name,publishers.publisher_name,books.*,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where (lower(categories.category_name) like '%${search}%' OR books.book_num like '%${search}%' OR lower(publishers.publisher_name) like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(books.author) like '%${search}%' OR sendrequest.otp like '%${search}%') AND employees.id=${req.params.emp_id}
  `;

    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
// all Bookrequest_pending_admin
Search_Route.get(
  "/Bookrequest_pending_admin/:search",
  async function (req, res) {
    const search = req.params.search;
    const query = `SELECT sendrequest.*,books.*,categories.category_name,publishers.publisher_name,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where (lower(categories.category_name) like '%${search}%' OR books.book_num like '%${search}%' OR lower(publishers.publisher_name) like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(employees.name) like '%${search}%' OR sendrequest.otp like '%${search}%') AND sendrequest.status=0
  `;

    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
Search_Route.get("/BookRequestAccept_admin/:search", async function (req, res) {
  const search = req.params.search;
  const query = `SELECT sendrequest.*,books.*,categories.category_name,publishers.publisher_name,employees.* from sendrequest 
  join books on  sendrequest.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on sendrequest.emp_id=employees.id where (lower(categories.category_name) like '%${search}%' OR books.book_num like '%${search}%' OR lower(publishers.publisher_name) like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(employees.name) like '%${search}%' OR sendrequest.otp like '%${search}%') AND sendrequest.status=1
  `;

  const result = await DBQuery(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// categoriesBook user
Search_Route.get("/categoriesBook/:search", async function (req, res) {
  const search = req.params.search;
  const query = `
     SELECT books.*,categories.category_name,publishers.publisher_name from books
     join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id where lower(categories.category_name) like '%${search}%' 
  OR lower(publishers.publisher_name) like '%${search}%' OR lower(title) like '%${search}%' OR book_num like '%${search}%' OR lower(author) like '%${search}%'
  `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
// categoriesBook_user
Search_Route.get("/categoriesBook_user/:search", async function (req, res) {
  const search = req.params.search;
  const query = `SELECT*FROM categories where lower(category_name) like '%${search}%'`;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

// previousRecord_user
Search_Route.get(
  "/previousRecord_user/:search/:emp_id",
  async function (req, res) {
    const search = req.params.search;
    console.log(req.params);
    const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
    join books on  bookrent.book_id=books.book_num
    join categories on categories.id=books.category_id
    join publishers on publishers.id=books.publisher_id
    join employees on bookrent.emp_id=employees.id where (lower(categories.category_name) like '%${search}%'OR lower(publishers.publisher_name) like '%${search}%' OR bookrent.old_book_no like '%${search}%'  OR books.book_num like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(books.author) like '%${search}%' OR lower(bookrent.status) like '%${search}%') AND employees.id=${req.params.emp_id}
  `;

    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

// booksearch
Search_Route.get("/booksearch/:search", async function (req, res) {
  const s = req.params;

  const query = ` SELECT books.*,categories.category_name,publishers.publisher_name from books
  join categories on categories.id=books.category_id
join publishers on publishers.id=books.publisher_id where lower(categories.category_name) like '%${s.search}%' OR lower(publishers.publisher_name) like '%${s.search}%' OR lower(title) like '%${s.search}%' OR book_num like '%${s.search}%' OR lower(author) like '%${s.search}%' OR lower(desk_number) like '%${s.search}%' `;

  const result = await DBQuery(query);
  console.log(s);
  console.log(result);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//booksearch_by_filter
Search_Route.get("/booksearch_by_filter/:type", async function (req, res) {
  const type = req.params.type;
  const query = ` SELECT books.*,categories.category_name,publishers.publisher_name from books
  join categories on categories.id=books.category_id
join publishers on publishers.id=books.publisher_id
 where categories.category_name like '%${type}%' OR publishers.publisher_name like '%${type}%' `;
  const result = await DBQuery(query);
  res.status(200).json({
    success: true,
    data: result,
  });
});
//searchRentDataByFilter
Search_Route.get("/searchRentDataByFilter/:type", async function (req, res) {
  const search = req.params.type;
  console.log(search);
  const query = `SELECT books.*,categories.category_name,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id where categories.category_name like '%${search}%' OR publishers.publisher_name like '%${search}%' OR bookrent.status like '%${search}%'   
  `;

  const result = await DBQuery(query);
  console.log(result);
  res.status(200).json({
    success: true,
    data: result,
  });
});

// bookrenewstatus_user
Search_Route.get(
  "/bookrenewstatus_user/:search/:emp_id",
  async function (req, res) {
    const { search, emp_id } = req.params;

    const query = `SELECT books.*,categories.category_name,bookrenew.*,publishers.publisher_name,employees.*,bookrent.* from bookrent
  join books on  bookrent.book_id=books.book_num
  join categories on categories.id=books.category_id
  join publishers on publishers.id=books.publisher_id
  join employees on bookrent.emp_id=employees.id
  join bookrenew on bookrenew.bookrent_id=bookrent.id where (books.book_num like '%${search}%' OR bookrent.old_book_no like '%${search}%' OR lower(books.title) like '%${search}%' OR lower(categories.category_name) like '%${search}%' OR lower(publishers.publisher_name) like '%${search}%' OR lower(books.author) like '%${search}%') and  employees.id=${emp_id}  order by bookrenew.id ASC
  `;
    const result = await DBQuery(query);
    res.status(200).json({
      success: true,
      data: result,
      msg: "Search result",
    });
  }
);

module.exports = Search_Route;
