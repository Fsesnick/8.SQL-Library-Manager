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
    //next(error);
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
router.get('/new',  (req, res) => {
  res.render('books/new-book', { title: 'New Book', book: {} });
});


/*The Article.build() method used above will return an 
non-persistent (or unsaved) model instance. The built 
instance holds the properties / values of the Article 
being created via req.body. It will get stored in the 
database by the create() method once the 
user submits the form with a valid title.
 */
//this rout in post('/') need to be the same on the pug action='/books'
/* POST create book. */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));


/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res,next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update-book", { book, title: book.title });  
  } else {
    const err = new Error();
    res.status(404);
    err.message = "This page doesn't exists.";
    next(err);
  }
}));

/**Update Book and renders a friendly msg in case of not author or name*/
router.post('/:id', asyncHandler(async (req, res) => {
let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {

      await book.update(req.body);
      res.redirect('/');
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book" })
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
