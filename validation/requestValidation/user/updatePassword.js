/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Input parameters validation for update password request
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

// Imports
import validator from 'express-validator';
const { body } = validator;

export default {
    updatePassword: [
        // New Password
        body("newPassword")
            .notEmpty().withMessage("New Password is required")
            .isStrongPassword({
                minLength: 6,
                maxLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).withMessage("New Password must contain atleast one capital letter and one number and one special character & Length should be within 6-12 digits"),

        // Old Password
        body('oldPassword')
            .notEmpty().withMessage("Old Password is required")

    ]
}
