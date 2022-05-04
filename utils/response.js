/**********************************************************************
 * Changelog										
 * All notable changes to this project will be documented in this file.	
 **********************************************************************
 *
 * Author			      : Parth Mehta
 *
 * Date created		   : 04/05/2022
 *
 * Purpose			      : API Success and Error Response Function
 *
 * Revision History	:
 *
 * Date			    Author			Jira			  Functionality 
 * 
 *********************************************************************
*/

/** Error Response Function
 * 
 * @param message - Error Response Message
 */
export const errorResponse = (message, data) => {
   return { status: "error", message: message, data: data };
}
/** Success Response Function
 * 
 * @param message -   Success Response Message 
 * @param data    -   Success Response Data
 */
export const successResponse = (message, data) => {
   return { status: "success", message: message, data: data };
}