/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author			      : Part Mehta
 *
 * Date created		      : 04/05/2022
 *
 * Purpose			      : Define Constant
 *
 * Revision History	:
 *
 * Date			    Author			Jira			  Functionality
 *
 *********************************************************************
*/

// CONSTANTS
export const HEADER_KEY_TOKEN = "auth"

// ERROR MESSAGE CONSTANTS
export const ERROR_MESSAGE = {
    USERNAME_PASSWORD_INCORRECT: "Username or Password is Incorrect",
    REQUIRED_PARAMETERS_MISSING: "REQUIRED PARAMETERS ARE MISSING",
    INTERNAL_SERVER_ERROR: "Internal server error",
    USER_NOT_EXISTS: "User not exist",
    USER_ALREADY_EXISTS: "User already exists",
    REQUIRE_TOKEN: "No token available, authorization denied!",
    INVALID_TOKEN: "Invalid Token, authorization denied",
    UNPROCESSABLE_ENTITY: "UNPROCESSABLE ENTITY",
    METHOD_NOT_ALLOWED: "Method Not Allowed",
    GENERIC_AUTHENTICATION_CHECK_ERROR: "Failed to Complete the Authentication Token Validation Check"
}

// HTTP STATUS CODES
export const HTTP_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    UNPROCESSABLE_ENTITY: 422,
    METHOD_NOT_ALLOW: 405,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
};

/**
 * We will use this configuration during upload of the Node.js Readable stream into block blob.
 * @type {{maxBuffers: number, bufferSize: number}}
 */
export const UPLOAD_OPTIONS = {
    bufferSize: 4 * 1024 * 1024,// Set the maximum length of a transfer to 4MB.
    maxBuffers: 20 // Set the maximum number of workers that may be used in a parallel transfer.
};

// Email RegEx
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
