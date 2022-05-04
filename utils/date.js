/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author			      : Part Mehta
 *
 * Date created		      : 04/05/2022
 *
 * Purpose			      : Contains the util functions related to date
 *
 * Revision History	:
 *
 * Date			    Author			Jira			  Functionality
 *
 *********************************************************************
 */

/**
 * This function will convert string into date
 * @param str {string} - Type would be string
 * @returns {*} - Returns the date object or maybe string
 */
export const convertIntoDate = function(str) {
    if (typeof str === "string" && str.length > 0) {
        return new Date(str);
    }
    return str;
}
