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
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to databse established.');
  } catch (error) {
    console.error('Connection to database failed: ', error);
  }
})();

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    
  const err = new Error();
  err.status = 404;
  err.header = "Page Not Found"
  err.message = "Sorry! We couldn't find the page you were looking for!";
  next(err);
});
app.use( (req, res, next) => {
  next(createError(404));
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    
  const err = new Error();
  err.status = 404;
  err.header = "Page Not Found"
  err.message = "Sorry! We couldn't find the page you were looking for!";
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err.status === 404) {
    res.status(404).render('page-not-found', { err });
  } else {
    err.message = err.message || 'Something is wrong!'
    res.status(err.status || 500).render('error', { err });
  }
});


module.exports = app;
