/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author			      : Part Mehta
 *
 * Date created		      : 04/05/2022
 *
 * Purpose			      : Contains the util functions related to arrays
 *
 * Revision History	:
 *
 * Date			    Author			Jira			  Functionality
 *
 *********************************************************************
 */

/**
 * This function will check if the following value is an array
 * and it has values based on that return boolean
 * @param array {*} - Type would be any
 * @returns {boolean} - Returns the boolean
 */
export const checkElements = function(array) {
    if (Array.isArray(array) && array.length > 0) {
        return true;
    }
    return false;
}

/**
 * This function will basically return a new array filled with numbers that will
 * be zero based index
 * @param total {number} - How many numbers you want to filled.
 * @return {Array} - Returns array
 */
export function filledArray(total) {
    const arr = [];
    if (total) {
        for (let i = 0; i < total; i++) {
            arr.push(i);
        }
        return arr;
    }
    return arr;
}

