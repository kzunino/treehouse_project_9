const express = require('express');
const db = require("../db");
const { User } = db.models;
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const router = express.Router();

const authenticateUser = async (req, res, next) => {
  try {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials) {
      // Attempt to retrieve the user from the data store
      // by their email address (i.e. the user's "key"
      // from the Authorization header).
      //credentials.name comes from username field submitted
      const user = await User.findOne({
            where: {
              emailAddress: credentials.name
            }
          });

      // If a user was successfully retrieved from the data store...
      if (user) {
        // Use the bcryptjs npm package to compare the user's password
        // (from the Authorization header) to the user's password
        // that was retrieved from the data store.
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);

          // If the passwords match...
           if (authenticated) {
             // Then store the retrieved user object on the request object
             // so any middleware functions that follow this middleware function
             // will have access to the user's information.
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
     // Or if user authentication succeeded...
     // Call the next() method.
     next();
   }
 } catch (error){
   next(error);
 }
};

// Protected Route that returns the current authenticated user.
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;

  res.json({
    message: "Welcome",
    firstName: user.firstName,
    lastName: user.lastName,
  });
});



// Route that creates a new user.
router.post('/users',[
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "firstName"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lastName"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "emailAddress"')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  check('password')
    .exists()
    .withMessage('Please provide a value for "password"'),
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
    let { firstName, lastName, emailAddress, password } = req.body;

    // Hash the new user's password.
    password = bcryptjs.hashSync(password);

    const newUser = await User.create({
      firstName,
      lastName,
      emailAddress,
      password
    })

    // Set the status to 201 Created and end the response.
    res.status(201).location('/').end();
  } catch (error){
    if(error.name === "SequelizeUniqueConstraintError"){
      res.status(501).json({
        error: "Email for user already exists"
      })
    }
    next(error)
  }
});


module.exports = router;
