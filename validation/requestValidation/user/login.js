/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 02/05/2022
 *
 * Purpose           : Input parameters validation for Login
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import validator from "express-validator";
const { body } = validator;

export default {
  login: [
    // Password
    body("password").custom((value) => {
      if (!value) {
        throw new Error("Password is required");
      } else {
        return true;
      }
    }),
  ]
};
