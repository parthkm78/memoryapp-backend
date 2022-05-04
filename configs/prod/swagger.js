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
    "title": "MemoryApp  APIs",
    "version": "1.0.0",
    "description": "Controller for Memory App API Calls are defined here",
    "url": "http://localhost:5000",
    "apis": ["./routes/api/v1/*.js"]
}
