/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Input parameters validation for update user request
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

// Imports
import validator from "express-validator";
const { body } = validator;
import User from "../../../model/user.js";

export default {
    updateUser: [
        // User Id
        // userName
        body('userName').custom(async (value, { req }) => {
            if (value) {
                if (!value.match('^[a-z0-9._]+$')) {
                    throw new Error('User name must be alphanumeric lowercase and support dot and underscore');
                }
                // check userName exists with anothe email ID
                return await User.findOne({ "userName": value, "isDeleted": false, _id: { $ne: req.body.userId } }).then(user => {
                    if (user) {
                        return Promise.reject('User name already in use');
                    }
                })
            }
            else {
                return true
            }
        })
    ]
}