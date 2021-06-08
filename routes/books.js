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

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/updateBook", { book, title: book.title });  
  } else {
    res.sendStatus(404);
  }
}));

router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/"+ book.id ); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("books/updateBook", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

/**
 * Routes missing:
 *   

    /books/:id/delete - post
 */

module.exports = router;
