
/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Mongo Database Service
 *
 * Revision History  :
 *
 * Date            Author            Jira          Functionality
 **********************************************************************
 */

// IMPORTS
import { logger } from "../../utils/logger.js";
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../utils/constants.js";
import { errorResponse } from "../../utils/response.js";

/**
 * Save collection record
 * @param model - collection
 * @param res
 * @param session
 * @returns
 */
export const saveRecordSession = async (model, res, session) => {
    return await model.save({session})
        .then((response) => {
            logger.info("model saved");
            return response;
        })
        .catch((err) => {
            logger.error("dbCollectionSession/saveRecordSession : Error while saving model information", err);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
                .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
        });
}

/**
 * Update collection record
 * @param model - collection
 * @param query
 * @param field
 * @param res
 * @param session
 * @returns
 */
export const updateSingleRecordSession = async (model, query, field, res, session) => {
    await model.updateOne(query, field).session(session).exec()
        .then((response) => {
            logger.info("model saved");
            return response;
        })
        .catch((err) => {
            logger.error("dbCollectionSession/updateSingleRecordSession : Error while updating model information", err);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
                .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
        });
}