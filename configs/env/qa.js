/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : export the config files for QA enviornment
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */
 export {default as CRYPTOCONFIG } from "../qa/crypto.js";
 export {default as SMTPCONFIG } from "../qa/smtp.js";
 export {default as LOGCONFIG } from "../qa/logger.js";
 export {default as DBCONFIG } from "../qa/database.js";
 export {default as SERVERCONFIG } from "../qa/server.js";
 export {default as SWAGGERCONFIG } from "../qa/swagger.js";
 export { default as AUTHSERVERCONFIG } from "../qa/authServer.js";
