/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author			      : Part Mehta
 *
 * Date created		      : 04/05/2022
 *
 * Purpose			      : Contains the util functions related to promise
 *
 * Revision History	:
 *
 * Date			    Author			Jira			  Functionality
 *
 *********************************************************************
 */

 /**
 * Axios helper function for the resolve promise
 * @param response {*} - The axios response object
 * @returns {Promise<*>} - Returns a resolved promise
 */
export function handleResolvePromise(response) {
    return response.data;
}

/**
 * Axios helper function for the reject promise
 * Basically, It will return a reject promise
 * @param error {*} - The axios error object
 * @returns {Promise<*>} - Returns a rejected promise
 */
export function handleRejectPromise(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return Promise.reject(error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return Promise.reject({ message: error.message });
    } else {
        // Something happened in setting up the request that triggered an Error
        return Promise.reject({ message: error.message });
    }
}
