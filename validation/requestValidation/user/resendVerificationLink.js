/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : Input parameters validation for Verification email
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
    verificationCode: [
        // loginType
        body('signUpType')
            .notEmpty().withMessage("signUpType is required")
    ]
}
