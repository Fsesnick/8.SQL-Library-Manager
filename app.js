var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var sequelize = require('./models').sequelize;
var indexRouter = require('./routes/index');
var libsRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', libsRouter);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  try {
    await sequelize.sync();
    console.log('database in sync');
  } catch (error) {
    console.log('Unable to sync the database', error);
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    
  const err = new Error();
  err.status = 404;
  err.header = "Page Not Found"
  err.message = "Sorry! We couldn't find the page you were looking for!";
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.status(404);
    res.render('page-not-found', {err});
  } else {
    console.log('500 error ');
    err.status = 500;
    err.message = 'Oops! There was a problem with the server';
    res.status(err.status).render('error', {err});
  }
});


module.exports = app;
