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
/* GET BOOKS listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
 // console.log(books)
  res.render("books/index", {books, title: "Welcome to the Library!" });
}));

// Create new book
router.get('/new', (req, res) => {
  res.render('books/new-book', { books: {}, title: "New Book" });
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book ; 
  book = await Book.create(req.body);
  res.redirect('/');
 
}));
/**
 * Routes missing:
 *   /books/:id - get
    /books/:id - post
    /books/:id/delete - post
 */

module.exports = router;
