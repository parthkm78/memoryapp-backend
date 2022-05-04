/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Contains the Swagger config
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

const port = process.env.PORT || 5000
export default {
    "open_api_version": "3.0.3",
    "title": "Cherie User API",
    "version": "1.0.0",
    "description": "Controller for Cherie API Calls are defined here",
    "url": "https://localhost:" + port,
    "apis": ["./routes/api/v2/*.js"]
}
