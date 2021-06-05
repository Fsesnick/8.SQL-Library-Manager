var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      res.status(500).send(error);
    }
  }
}

/* GET articles listing. */
router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  console.log(books)
  res.render("book/allBooks", {books, title: "Welcome to the Library!" });
}));

module.exports = router;
