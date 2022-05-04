/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : export the config files for PROD enviornment
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

 export { default as CRYPTOCONFIG } from "../prod/crypto.js";
 export { default as SMTPCONFIG } from "../prod/smtp.js";
 export { default as LOGCONFIG } from "../prod/logger.js";
 export { default as DBCONFIG } from "../prod/database.js";
 export { default as SERVERCONFIG } from "../prod/server.js";
 export { default as SWAGGERCONFIG } from "../prod/swagger.js";
 export { default as AUTHSERVERCONFIG } from "../prod/authServer.js";
 export { default as AZURESTORAGECONFIG } from "../prod/azureStorage.js";
