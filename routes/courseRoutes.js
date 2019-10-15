const express = require('express');
const router = express.Router();
const db = require("../db");
const { Course } = db.models;

router.get("/courses", async (req, res, next) =>{
  try {
    const course = await Course.findAll({
      order: [["title", "ASC"]]
    });
    res.json(course);
  } catch (error) {
    return next(error);
  }
})

module.exports = router;
