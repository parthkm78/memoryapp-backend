/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Input parameters validation for Personal & Company SignUp
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import validator from "express-validator";
const { body } = validator;
import User from "../../../model/user.js";

export default {
  signup: [
    // Password
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 6,
        maxLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must contain atleast one capital letter and one number and one special character & Length should be within 6-12 digits"
      )
  ],

  signByAdmin: [
    // Account Type
    body("accountType")
      .isIn(["PERSONAL"])
      .withMessage("Account type should be PERSONAL"),

    // UserName
    body("userName")
      .notEmpty()
      .withMessage("User name is required")
      .bail()
      .isLength({ max: 11 })
      .withMessage("Maximum legth of User name is 11")
      .bail()
      .custom(async (value) => {
        if (!value.match("^[a-z0-9._]+$")) {
          throw new Error(
            "User name must be alphanumeric lowercase and support dot and underscore"
          );
        }
        return await User.findOne({ userName: value, isDeleted: false }).then(
          (user) => {
            if (user) {
              return Promise.reject("User name already in use");
            }
          }
        );
      }),

    // First Name
    body("firstName")
      .notEmpty()
      .withMessage("First Name is required")
      .bail()
      .isLength({ max: 11 })
      .withMessage("Maximum legth of first name is 11")
      .bail()
      .isAlpha()
      .withMessage("First name must be letters only")
      .bail(),

    // Last Name
    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .bail()
      .isLength({ max: 11 })
      .withMessage("Maximum legth of Last name is 11")
      .bail()
      .isAlpha()
      .withMessage("Last name must be letters only")
      .bail(),

    // Password
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 6,
        maxLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must contain atleast one capital letter and one number and one special character & Length should be within 6-12 digits"
      ),

    // Email
    body("userEmail")
      .notEmpty()
      .withMessage("Email address is required")
      .bail()
      .isEmail()
      .withMessage("Invalid email address")
      .bail()
      .custom(async (value) => {
        // below line is commented. If we only have to search without deleted account
        // return await User.findOne({ "email": value, "isDeleted": false }).then(user => {
        return await User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already in use");
          }
        });
      }),
  ],
};
