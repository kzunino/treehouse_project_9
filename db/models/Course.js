'use strict';
const Sequelize = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "userId"',
        }
      },
      notNull:{
        msg: 'Please provide a value for "userId"',
      }
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "title"',
        }
      },
      notNull:{
        msg: 'Please provide a value for "title"',
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "description"',
        }
      },
      notNull:{
        msg: 'Please provide a value for "descritpion"',
      }
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: true,
      // validate: {
      //   notEmpty: {
      //     msg: 'Please provide a value for "estimatedTime"',
      //   }
      // },
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      allowNull: true,
      // validate: {
      //   notEmpty: {
      //     msg: 'Please provide a value for "materialsNeeded"',
      //   }
      // },
    },
  }, {
      //paranoid: true,     //enables soft deletes
      timestamps: true,
      freezeTableName: false,
      modelName: 'Course',
      tableName: 'Courses',
      sequelize
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };


  return Course;
};
