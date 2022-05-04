/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
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
import { getUsers, getUsersCount, searchUsers, fetchDetail} from "../../../controllers/v1/user.js";
import { validateAuth } from "../../../middlewares/v1/auth.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     fetchUserDetailById:
 *       type: object
 *       properties:
 *         idOfUser :
 *           type: string
 *           description: The User ID
 *       example:
 *         idOfUser : 6173cd2e6fa20746c59702bf
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
 *     getUsers:
 *       type: object
 *       properties:
 *         page :
 *           type: integer
 *           description: The number of page
 *         limit :
 *           type: integer
 *           description: The records per page
 *         sort :
 *           type: object
 *           description: The sorting parameters
 *         filter :
 *           type: object
 *           description: The filter fields
 *         search :
 *           type: string
 *           description: The search field
 *       example:
 *         page : 1
 *         limit : 2
 *         sort : {}
 *         search : ""
 *         filter : {}
 *     searchUsers:
 *       type: object
 *       properties:
 *         page :
 *           type: integer
 *           description: The number of page
 *         limit :
 *           type: integer
 *           description: The records per page
 *         sort :
 *           type: object
 *           description: The sorting parameters
 *         filter :
 *           type: string
 *           description: The filter fields
 *         returnFields :
 *           type: object
 *           description: The return fields
 *       example:
 *         page : 1
 *         limit : 2
 *         sort : {}
 *         filter : ""
 *         returnFields : {}
 *     getUsersCount:
 *       type: object
 *       properties:
 *         filter :
 *           type: object
 *           description: The filter fields
 *         search :
 *           type: string
 *           description: The search field
 *       example:
 *         filter : {}
 *         search : ""
 */

/**
* @swagger
* /user/info:
*  get:
*    summary: Fetch user's detail
*    tags:
*     - User Detail
*    parameters:
*      - in: header
*        name: auth
*        schema:
*          type: string
*        required: true
*        description: Authentication Token
*    responses:
*      200:
*        description: User detail fetched successfully.
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/detail'
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/info")
  .get(validateAuth, fetchDetail);

// /**
//  * @swagger
//  * /user/info:
//  *  post:
//  *    summary: Fetch user's detail by userId
//  *    tags:User detai
//  *     - User Detail
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            $ref: '#/components/schemas/fetchUserDetailById'
//  *    parameters:
//  *      - in: header
//  *        name: auth
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: Authentication Token
//  *    responses:
//  *      200:
//  *        description: User detail fetched successfully.
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/detail'
//  *      500:
//  *        description: Internal Server Error
//  *      400:
//  *        description: Bad Request
//  *      405:
//  *        description: Method Not Allowed
//  */
// router.route("/detail")
//     .post(validateAuth, fetchDetailByUserId);

/**
* @swagger
* /user/list/count:
*  post:
*    summary: get users count
*    tags:
*     - User Detail
*    parameters:
*      - in: header
*        name: auth
*        schema:
*          type: string
*        required: true
*        description: Authentication Token
*    requestBody:
*      required: false
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/getUsersCount'
*    responses:
*      200:
*        description: Users detail fetched successfully.
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/list/count")
  .post(validateAuth, getUsersCount);

/**
* @swagger
* /user/list:
*  post:
*    summary: get users detail
*    tags:
*     - User Detail
*    parameters:
*      - in: header
*        name: auth
*        schema:
*          type: string
*        required: true
*        description: Authentication Token
*    requestBody:
*      required: false
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/getUsers'
*    responses:
*      200:
*        description: Users detail fetched successfully.
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/list")
  .post(validateAuth, getUsers);

/**
 * @swagger
 * /user/search/userName:
 *  post:
 *    summary: search users detail
 *    tags:
 *     - User Detail
 *    requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/searchUsers'
 *    responses:
 *      200:
 *        description: Users detail fetched successfully.
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      405:
 *        description: Method Not Allowed
 */


router.route("/search/userName")
  .post(searchUsers);

export default router;
