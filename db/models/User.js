'use strict';
const Sequelize = require('sequelize');


module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "first name"',
        }
      },
      notNull:{
        msg: 'Please provide a value for "first name"',
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "last name"',
        }
      },
      notNull:{
        msg: 'Please provide a value for "last name"',
      }
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "email"',
        }
      },
      notNull:{
        msg: 'Please provide a value for "email"',
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "password"',
        }
      },
      notNull:{
        msg: 'Please provide a value for "password"',
      },
    },
  }, {
      //paranoid: true,     //enables soft deletes
      timestamps: true,
      freezeTableName: false,
      modelName: 'User',
      tableName: 'Users',
      sequelize
  });

//creates associations between models
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };

  return User;
};
