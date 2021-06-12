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

//404 handler
app.use( (req, res, next) => {

  console.log('404 error handler called');
  res.status(404).render('page-not-found');
});

//Global error handler
app.use((err, req, res, next) =>{

console.log("Global");
    if(err){
      console.log('Global error handler call', err);
    }

    if(err.status===404){
      res.status(404).render("page-not-found", {err});
    }else{
      err.message = err.message ||'Something is wrong!';
      res.status(err.status || 500).render('error', { err });
    }

});

module.exports = app;

