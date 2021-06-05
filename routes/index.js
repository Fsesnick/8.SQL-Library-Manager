var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
const Sequelize = require('sequelize');

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.redirect("/book");
});

module.exports = router;


