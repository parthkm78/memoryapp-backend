/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Input parameters validation for email
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

 import validator from 'express-validator';
 const { body } = validator;
 
 export default {
     sendEmail: [
         // Email
         body('email')
             .notEmpty().withMessage("Email address is required")
     ]
 }