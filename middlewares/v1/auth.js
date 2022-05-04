/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : Auth validation
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

 import { logger } from "../../utils/logger.js";
 import { errorResponse } from "../../utils/response.js";
 import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../utils/constants.js";
 import { validateToken } from "../../services/auth/auth.js";
 
 /**
  * Validate Auth token
  *
  * @param {object} request The request object
  * @param {object} response The response object
  * @param {object} next The next object
  **/
 export const validateAuth = async (request, response, next) => {
     try {
         if (!request.header("auth") && (
                 request.originalUrl.toLowerCase().includes('/signup'.toLowerCase()) ||
                 request.originalUrl.toLowerCase().includes('/verifyEmail'.toLowerCase())
             )
         ) {
             next();
         } else if (request.header("auth")) {
             let authRes = await validateToken(request, response);
             if (!authRes || !authRes.data || authRes.data.status == "error") {
                 logger.info("Invalid Token:", authRes)
                 if (authRes.data && authRes.data.status === 'error') {
                     return response
                         .status(authRes.data.data.status)
                         .json(errorResponse(authRes.data.message || "Error while calling auth service", { sessionExpired: authRes.data.data.sessionExpired }));
                 }
                 return response
                     .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
                     .json(errorResponse("Error while calling auth service"));
             }
             if (request.originalUrl.toLowerCase().includes('/signup'.toLowerCase())) {
                 request.body.authEmail = authRes.data.data.email;
             }
             else {
                 request.body.email = authRes.data.data.email;
             }
             request.body.role = authRes.data.data.role;
             request.body.userId = authRes.data.data.userId;
             request.body.language = authRes.data.data.language;
             next();
         }
         else {
             return response
                 .status(HTTP_STATUS_CODE.BAD_REQUEST)
                 .json(errorResponse(ERROR_MESSAGE.REQUIRE_TOKEN));
         }
     } catch (err) {
         logger.error("2 Auth Middleware : User Authentication Error in Authentication: " + err.message)
         return response
             .status(HTTP_STATUS_CODE.BAD_REQUEST)
             .json(errorResponse(ERROR_MESSAGE.GENERIC_AUTHENTICATION_CHECK_ERROR));
     }
 }
 