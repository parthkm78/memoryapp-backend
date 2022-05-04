/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : export the config files for DEV enviornment
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

export { default as CRYPTOCONFIG } from "../dev/crypto.js";
export { default as SMTPCONFIG } from "../dev/smtp.js";
export { default as LOGCONFIG } from "../dev/logger.js";
export { default as DBCONFIG } from "../dev/database.js";
export { default as SERVERCONFIG } from "../dev/server.js";
export { default as SWAGGERCONFIG } from "../dev/swagger.js";
export { default as AUTHSERVERCONFIG } from "../dev/authServer.js";
export { default as AZURESTORAGECONFIG } from "../dev/azureStorage.js";
export { default as FILEUPLOADCONFIG } from "../dev/fileUpload.js";