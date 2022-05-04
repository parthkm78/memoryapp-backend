
/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : Mail Utilities
 *
 * Revision History  :
 *
 * Date            Author            Jira          Functionality
 **********************************************************************
 */

import axios from "axios";
import https from "https";
import { errorResponse } from "../../utils/response.js";
import { HTTP_STATUS_CODE } from "../../utils/constants.js";
import { logger } from "../../utils/logger.js";
import { CONFIGS } from "../../configs/configExport.js";
const { AUTHSERVERCONFIG } = CONFIGS;

/**
 * Calling generate token service
 * @param {*} emailOrPhoneNo - emailOrPhoneNo of user
 * @param {*} password - password of user
 * @param isPassCodeLogin
 * @param userId
 * @param deviceToken
 * @param deviceId
 * @param loginType
 */
export const generateToken = async (emailOrPhoneNo, password, isPassCodeLogin, userId, deviceToken, deviceId, loginType) => {
    return await axios.post(AUTHSERVERCONFIG.url + AUTHSERVERCONFIG.generateToken, {
        data: { emailOrPhoneNo, password, userId, deviceToken, loginType, isPassCodeLogin, deviceId },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        rejectUnauthorized: false,
        httpsAgent: https.Agent({rejectUnauthorized: false})
    })
}

/**
 *  Validate token service
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const validateToken = async (req, res) => {
    return await axios.post(AUTHSERVERCONFIG.url + AUTHSERVERCONFIG.validateToken, {
        rejectUnauthorized: false,
        httpsAgent: https.Agent({rejectUnauthorized: false}),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "auth": req.header("auth")
        }
    }).catch(function (error) {
        logger.info("services/validateToken : error while calling auth validateToken service:", error)
        return res
            .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
            .json(errorResponse("Error while calling auth token validate service"));
    });
}
