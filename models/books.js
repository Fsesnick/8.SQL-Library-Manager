'use strict';
const Sequelize = require('sequelize');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false, // disallow null
      validate: {
          notNull: {
              msg: 'Please provide a value for "title"',
            },
          notEmpty: {
          // custom error message
              msg: 'Please provide a value for "title"',
        },
       },
      },
    author: {
      type: Sequelize.STRING,
      allowNull: false, // disallow null
      validate: {
          notEmpty: {
          // custom error message
              msg: 'Please provide a value for "Author"',
        },
       },
      },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};