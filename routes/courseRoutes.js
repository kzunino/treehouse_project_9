const express = require('express');
const router = express.Router();
const db = require("../db");
const { Course, User } = db.models;
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');


router.get("/courses", async (req, res, next) => {
  try {
    const course = await Course.findAll({
      order: [["id", "ASC"]]
    });
    res.json(course);
  } catch (error) {
    return next(error);
  }
});

router.get("/courses/:id", async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course){
      res.json(course).status(200).end();
    } else {
      res.status(404).json({
        message: 'Course Not Found',
        });
    }
  } catch (error) {
    return next(error);
  }
});

const authenticateUser = async (req, res, next) => {
  try {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials) {
      const user = await User.findOne({
            where: {
              emailAddress: credentials.name
            }
          });
      // If a user was successfully retrieved from the data store...
      if (user) {
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);

          // If the passwords match...
           if (authenticated) {
             req.currentUser = user;
           } else {
             message = `Authentication failure for username: ${user.emailAddress}`;
           }
         } else {
           message = `User not found for username: ${credentials.emailAddress}`;
         }
       } else {
         message = 'Auth header not found';
       }
   // If user authentication failed...
   if (message) {
     console.warn(message);
     // Return a response with a 401 Unauthorized HTTP status code.
     res.status(401).json({ message: 'Access Denied' });
   } else {
     next();
   }
 } catch (error){
   next(error);
 }
};

router.post('/courses', authenticateUser, [
  check('title')
    .exists()
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists()
    .withMessage('Please provide a value for "description"'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);

      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    }

    // Get the user info from the request body--destructuring.
    let { title, description, estimatedTime, materialsNeeded } = req.body;
    let userId = req.currentUser.id;

    const newCourse = await Course.create({
      title,
      description,
      userId,
      estimatedTime,
      materialsNeeded
    })

    // Set the status to 201 Created and end the response.
    res.status(201).end();
  } catch (error){
    next(error)
  }
});

router.put("/courses/:id", authenticateUser, [
  check('title')
    .exists()
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists()
    .withMessage('Please provide a value for "description"'),
], async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      let { title, description, estimatedTime, materialsNeeded } = req.body;
      let userId = req.currentUser.id;
      await Course.update(
        { title, description, userId, estimatedTime, materialsNeeded },
        { where: {
          userId: userId
          }
        }
       );
      res.json(course).status(200).end();
    } else {
      res.status(404).json({
        message: 'Course Not Found',
        });
    }
  } catch (error) {
    return next(error);
  }
});


module.exports = router;
