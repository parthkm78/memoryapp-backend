/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Memories related APIs
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
  **********************************************************************
 */

import express from "express";
var router = express.Router();
import { fetchMemories, getMemoriesCount, fetchPublicMemories, uploadMemory, getPublicMemoriesCount } from "../../../controllers/v1/memories.js";
import { validateAuth } from "../../../middlewares/v1/auth.js"
import { multerMiddlewareForMemories } from "../../../middlewares/v1/multer.js";
import { redisGetMemories, redisGetMemoriesCount} from "../../../middlewares/v1/redis.js";


/**
 * @swagger
 * components:
 *   schemas:
*     getMemories:
*       type: object
*       properties:
*         page :
*           type: string
*           description: The number of page
*         limit :
*           type: string
*           description: The records per page
*         sort :
*           type: object
*           description: The Artist ID
*         filter :
*           type: object
*           description: The filter fields
*       example:
*         page : 1
*         limit : 2
*         sort : {}
*         filter : {}
*     getArtsCount:
*       type: object
*       properties:
*         filter :
*           type: object
*           description: The filter fields
*       example:
*         filter : {}
* 
*     geMemoriesCount:
*       type: object
*       properties:
*         filter :
*           type: object
*           description: The filter fields
*       example:
*         filter : {}
*
*     gePublicMemoriesCount:
*       type: object
*       properties:
*         filter :
*           type: object
*           description: The filter fields
*       example:
*/

/**
 * @swagger
 * /user/post:
 *  post:
 *    summary: Add memory
 *    tags:
 *      - Memories
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
 *        multipart/form-data:
 *          schema:
 *              type: object
 *              required: [memoryFile]
 *              properties:
 *                  memoryFile:
 *                       type: string
 *                       format: binary
 *                       description: The Image
 *                  fileType:
 *                       type: string
 *                       description: The memory file type
 *                  description:
 *                       type: string
 *                       description: The memory description
 *                  fileTvisibilityype:
 *                       type: string
 *                       description: The memory visibility
 *
 *    responses:
 *      201:
 *        description: Memory  added successfully.
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      405:
 *        description: Method Not Allowed
 */
router.route("/post")
  .post(multerMiddlewareForMemories, validateAuth, uploadMemory);

/**
* @swagger
* /user/post/own/list:
*  post:
*    summary: get user's memories detail
*    tags:
*      - Memories
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/getMemories'
*    responses:
*      200:
*        description: Memories detail fetched sucessfully.
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/post/own/list")
  .post(multerMiddlewareForMemories, validateAuth, fetchMemories);

/**
* @swagger
* /user/post/own/count:
*  post:
*    summary: Get Memories count
*    tags:
*      - Memories
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
*            $ref: '#/components/schemas/geMemoriesCount'
*    responses:
*      200:
*        description: Memories count fetched sucessfully.
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/post/own/count")
  .post(multerMiddlewareForMemories, validateAuth, getMemoriesCount);

/**
* @swagger
* /user/post/public/list:
*  post:
*    summary: get public memories detail
*    tags:
*      - Memories
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/getMemories'
*    responses:
*      200:
*        description: Memories detail fetched sucessfully.
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/post/public/list")
  .post(redisGetMemories, fetchPublicMemories);

/**
* @swagger
* /user/post/public/count:
*  post:
*    summary: Get Public Memories count
*    tags:
*      - Memories
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
*            $ref: '#/components/schemas/gePublicMemoriesCount'
*    responses:
*      200:
*        description: Memories count fetched sucessfully.
*      500:
*        description: Internal Server Error
*      400:
*        description: Bad Request
*      405:
*        description: Method Not Allowed
*/
router.route("/post/public/count")
  .post(redisGetMemoriesCount, getPublicMemoriesCount );


export default router;
