var express = require('express');
var router = express.Router();
const Book = require('../models').Book;


/**
the catch block in the asyncHandler function is the  part of 
the code that's handling rejected Promises returned from the database calls. 
It catches an error (or a rejected promise) that occurs in a route 
 */

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


/*The Article.build() method used above will return an 
non-persistent (or unsaved) model instance. The built 
instance holds the properties / values of the Article 
being created via req.body. It will get stored in the 
database by the create() method once the 
user submits the form with a valid title.
 */

/* POST create book. */

router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
      book = await Book.create(req.body);
      res.redirect('/');
  } catch (error) {
      if (error.name === 'SequelizeValidationError') {
          book = await Book.build(req.body);
          res.render('new-book', { book, errors: error.errors, title: 'New Book' })
      } else {
          throw error; // error caught in the asyncHandler's catch block
      }
  }
}));

/* POST create book. 
router.post('/new', asyncHandler(async (req, res) => {
  let book ; 
  book = await Book.create(req.body);
  res.redirect('/');
 
}));
*/

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update-book", { book, title: book.title });  
  } else {
    const err = new Error("This page doesn't exists.");
    res.status(404);
    res.render('page-not-found', {err});
  }
}));

router.post('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  try {
    if(book) {
      console.log(req.body);
      await book.update(req.body);
      res.redirect('/');
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

/* route to delete a book */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect("/books");
  }else{
    res.sendStatus(404);
  }

}));

module.exports = router;
