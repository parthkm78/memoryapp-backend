/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : User related APIs
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
  **********************************************************************
 */

import express from "express";
var router = express.Router();
import { errorResponse } from "../../../utils/response.js";
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../../utils/constants.js";
import { login, signup, deleteUser, updateUser, updatePassword, verifyEmail, resendVerificationLink, newPassword, forgetPassword } from "../../../controllers/v1/user.js";
import signupSchemaValidator from "../../../validation/requestValidation/user/signup.js";
import updatePasswordSchemaValidator from "../../../validation/requestValidation/user/updatePassword.js";
import loginSchemaValidator from "../../../validation/requestValidation/user/login.js";
import forgetPasswordSchemaValidator from "../../../validation/requestValidation/user/sendEmailForForgetPassword.js";
import newPasswordSchemaValidator from "../../../validation/requestValidation/user/newPassword.js";
import updateUserSchemaValidator from "../../../validation/requestValidation/user/updateUser.js";
import { validateAuth } from "../../../middlewares/v1/auth.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     personalUser:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - accountType
 *         - userName
 *         - country
 *         - contactNo
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first Name
 *         lastName:
 *           type: string
 *           description: The user's last Name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         accountType:
 *           type: string
 *           description: The user's accountType
 *         userName:
 *           type: string
 *           description: The user's userName
 *         country:
 *           type: string
 *           description: The user's country
 *         contactNo:
 *           type: string
 *           description: The user's contract number
 *       example:
 *         firstName: test
 *         lastName: abc
 *         email: abc.abc@abc.com
 *         password: Test@1234
 *         accountType : PERSONAL
 *         userName : user1
 *         contactNo : "7777777987"
 *         country : IND
 *     signupByAdmin:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - userEmail
 *         - password
 *         - accountType
 *         - userName
 *         - country
 *         - contactNo
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first Name
 *         lastName:
 *           type: string
 *           description: The user's last Name
 *         userEmail:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         accountType:
 *           type: string
 *           description: The user's accountType
 *         userName:
 *           type: string
 *           description: The user's userName
 *         country:
 *           type: string
 *           description: The user's country
 *         contactNo:
 *           type: string
 *           description: The user's contract number
 *       example:
 *         firstName: test
 *         lastName: abc
 *         userEmail: abc.abc@abc.com
 *         password: Test@1234
 *         accountType : PERSONAL
 *         userName : user1
 *         contactNo : "7777777987"
 *         country : IND
 *     login:
 *       type: object
 *       required:
 *         - email
 *         - accountType
 *         - userName
 *         - firstName
 *         - socialMediaType
 *         - socialMediaId
 *         - deviceToken
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         accountType:
 *           type: string
 *           description: The user's accountType
 *         userName:
 *           type: string
 *           description: The user's userName
 *         firstName:
 *           type: string
 *           description: The user's firstName
 *         socialMediaType:
 *           type: string
 *           description: The user's socialMediaType
 *         socialMediaId:
 *           type: string
 *           description: The user's socialMediaId
 *         deviceToken:
 *           type: string
 *           description: The user's deviceToken
*       example:
 *         email: test@gmail.com
 *         accountType: PERSONAL
 *         userName: test
 *         firstName: xyz
 *         socialMediaType: GOOGLE
 *         socialMediaId: google123
 *         deviceToken: sadasdasdsad
 *     companyUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - accountType
 *         - companyName
 *         - country
 *         - contactNo
 *         - userName
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         accountType:
 *           type: string
 *           description: The user's accountType
 *         companyName:
 *           type: string
 *           description: The user's comanyName
 *         userName:
 *           type: string
 *           description: The user's userName
 *         country:
 *           type: string
 *           description: The user's country
 *         contactNo:
 *           type: string
 *           description: The user's mobile number
 *       example:
 *         email: abc.company@abc.com
 *         password: teTst@1234
 *         accountType : COMPANY
 *         companyName : userTest
 *         userName : user1
 *         country : IND
 *         contactNo : "7777777987"
 *     newPassword:
 *       type: object
 *       required:
 *         - email
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         nePassword:
 *           type: string
 *           description: The user's new password
 *       example:
 *         email: test@gmail.com
 *         newPassword: ABC@1test
 *     forgetPassword:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *       example:
 *         email: test@gmail.com
 *     updatePassword:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           description: The user's old password
 *         newPassword:
 *           type: string
 *           description: The user's new password
 *       example:
 *         oldPassword : test@1234
 *         newPassword : new@1234
 *     userDetail:
 *       type: object
 *       properties:
 *       example:
 *     resendVerificationLink:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *       example:
 *         email: abc.abc@abc.com
 *
 *     deleteUsers:
 *       type: object
 *       required:
 *         - users
 *       properties:
 *         users:
 *           type: array
 *           description: The list of ID of users
 *           items:
 *              type: string
 *       example:
 *          users :  [ "dddsdsd" ]
 *
 *     deleteUser:
 *       type: object
 *       required:
 *         - users
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of users
 *       example:
 *          id :  "dddsdsd"
 *
 *     updateUser:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         userName:
 *           type: string
 *           description: The User name
 *         companyName:
 *           type: string
 *           description: The Company name
 *         role:
 *           type: string
 *           description: The User role
 *         country:
 *           type: string
 *           description: The User country
 *         contactNo:
 *           type: string
 *           description: The User contactNo
 *         settings:
 *           type : object
 *           properties:
 *             notification:
 *               type: object
 *               properties:
 *                 isNotice:
 *                   type: boolean
 *                   description: Notice Notification
 *                 isNews:
 *                   type: boolean
 *                   description: News Notification
 *                 isWork:
 *                   type: boolean
 *                   description: Work Notification
 *                 isLikeFollowComment:
 *                   type: boolean
 *                   description: Like, Follow & Comment Notification
 *                 isAssetChange:
 *                   type: boolean
 *                   description: Asset Change Notification
 *       example:
 *         userName: User-1
 *         companyName: The Italian-User
 *         role : USER
 *         country: INDIA
 *         contactNo  : +44-98989889
 *         settings:
 *            language: en
 *
 */

/**
 * @swagger
 * /user/signup:
 *  post:
 *    summary: SignUp user
 *    tags:
 *     - User
 *    parameters:
 *      - in: header
 *        name: auth
 *        schema:
 *          type: string
 *        required: false
 *        description: Authentication Token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/personalUser'
 *    responses:
 *      201:
 *        description: SignUp sucessfuly. A verification email has been sent.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/personalUser'
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      405:
 *        description: Method Not Allowed
 */

router.route("/signup")
  .post(validateAuth, signupSchemaValidator.signup, signup)
  .all((req, res) => {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
  });



/**
* @swagger
* /user/password:
*  put:
*    summary: Update user's password
*    tags:
*     - User
*    parameters:
*      - in: header
*        name: auth
*        schema:
*          type: string
*        required: true
*        description: Authentication Token
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/updatePassword'
*    responses:
*      200:
*        description: User password updated successfully.
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/updatePassword'
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/password")
  .put(validateAuth, updatePasswordSchemaValidator.updatePassword, updatePassword)
  .all((req, res) => {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
  });


/**
* @swagger
* /user/login:
*  post:
*    summary: Login for User
*    tags:
*     - User
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/login'
*    responses:
*      200:
*        description: User successfully logged in.
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/login'
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      401:
*        description: UnAuthorized
*      405:
*        description: Method Not Allowed
*/
router.route("/login")
  .post(loginSchemaValidator.login, login)
  .all((req, res) => {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
  });


/*
* Verify mail
*/
router.route("/:userId/verifyEmail/:token")
  .get(verifyEmail)
  .all((req, res) => {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
  });


/**
* @swagger
* /user/verificationLink/resend:
*  post:
*    summary: Resend verification Link
*    tags:
*     - User
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/resendVerificationLink'
*    responses:
*      200:
*        description: Resend verification Link.
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/resendVerificationLink'
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/verificationLink/resend")
  .post( resendVerificationLink)
  .all((req, res) => {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
  });

/**
 *  New password ( forgot password option )
 */
router.route("/:userId/forgetPassword/:token")
  .put(newPasswordSchemaValidator.newPassword, newPassword)
  .all((req, res) => {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
  });

/**
* @swagger
* /user/password/forget:
*  post:
*    summary: Send email for forget password
*    tags:
*     - User
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/forgetPassword'
*    responses:
*      200:
*        description: Resend verification Link.
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/forgetPassword'
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/password/forget")
  .post(forgetPasswordSchemaValidator.sendEmail, forgetPassword)
  .all((req, res) => {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
  });

/**
 * @swagger
 * /user/detail:
 *  put:
 *    summary: Update User detail
 *    tags:
 *     - User
 *    parameters:
 *      - in: header
 *        name: auth
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication Token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updateUser'
 *    responses:
 *      200:
 *        description: User detail updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/updateUser'
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      405:
 *        description: Method Not Allowed
 */
router.route("/detail")
  .put(validateAuth, updateUserSchemaValidator.updateUser, updateUser);


/**
* @swagger
* /user/detail:
*  delete:
*    summary: Delete User
*    tags:
*     - User
*    parameters:
*      - in: header
*        name: auth
*        schema:
*          type: string
*        required: true
*        description: Authentication Token
*    responses:
*      200:
*        description: User deleted successfully.
*      400:
*        description: Bad Request
*      500:
*        description: Internal Server Error
*      405:
*        description: Method Not Allowed
*/
router.route("/detail")
  .delete(validateAuth, deleteUser);

export default router;
