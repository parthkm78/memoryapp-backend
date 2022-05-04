/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author			      : Part Mehta
 *
 * Date created		      : 04/05/2022
 *
 * Purpose			      : Contains the util functions for the Azure storage
 *
 * Revision History	:
 *
 * Date			    Author			Jira			  Functionality
 *
 *********************************************************************
 */


/**
 * This function will take the blob Uri and return the last segment.
 * @param value - string
 * @returns {string}
 */
export const getLastSegmentOfBlob = function(value) {
    const decodeURI = decodeURIComponent(value);
    return decodeURI.substring(decodeURI.lastIndexOf('/') + 1)
}
