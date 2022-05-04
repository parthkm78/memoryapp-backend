/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : User related APIs
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
  **********************************************************************
 */

import { errorResponse, successResponse } from "../../utils/response.js";
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../utils/constants.js";
import User from "../../model/user.js";
import MemoryPost from "../../model/memories.js"
import { logger } from "../../utils/logger.js";
import { addMemoryObj } from "../../utils/object.js";
import { fetchRecord, saveRecord, fetchRecordCount, aggregateRecordsExcludeLookup } from "../../services/database/dbCollection.js";
import validator from 'express-validator';
import { v4 as uuidv4 } from "uuid";
import intoStream from "into-stream";
import { CONFIGS } from "../../configs/configExport.js";
const { FILEUPLOADCONFIG } = CONFIGS;
const { validationResult } = validator;


/**
* user profile picture and cover picture
*
* @param {object} req The request object
* @param {object} res The response object
**/
export const uploadMemory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }
    const { containerInstances } = req;
    // fetch user
    let user = await fetchRecord(User, { _id: req.body.userId });

    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("User does not exists"));
    }

    // Get the old Blob Name
        let streamProfile ;
       // check memory type 
       if(req.memoryType.toLowerCase() == "text")
       {
        streamProfile = intoStream(req.memoryDescription);
       }else{
        streamProfile = intoStream(eq.files.memoryFile[0].buffer);
       }

      // upoad file and get URL
      const blockBlobClient = await uploadBlob(containerInstances, FILEUPLOADCONFIG.containerName, streamProfile, file, FILEUPLOADCONFIG.baseUrl+ `/${user._id}/${uuidv4()}`);
      
      let updateObj = await addMemoryObj(user._id, req.body, blockBlobClient.url);
    
      // add memory related details
      await saveRecord(MemoryPost, res);
        
    return res.
      status(HTTP_STATUS_CODE.CREATED)
      .json(successResponse("User images added successfully"));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

/**
* Fetch user's Post
*
* @param {object} req The request object
* @param {object} res The response object
**/
export const fetchMemories = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
            .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    //-------- Configure default sorting-------
    if (!req.body.sort || Object.keys(req.body.sort).length === 0) {
        req.body.sort = { registeredDate: -1 }
    }
    // fetch values
    let memories = await aggregateRecordsExcludeLookup(
      MemoryPost, { _userId : user.body.userId }, req.body.limit, req.body.page, req.body.sort || { "createdAt" : -1 }, { "password": 0, "__v": 0 } );

    return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Arts detail fetched sucessfully", { memories: memories }));
}
catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
};
}


/**
* Fetch user's Post
*
* @param {object} req The request object
* @param {object} res The response object
**/
export const fetchPublicMemories = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
            .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    //-------- Configure default sorting-------
    if (!req.body.sort || Object.keys(req.body.sort).length === 0) {
        req.body.sort = { registeredDate: -1 }
    }
    // fetch values
    let memories = await aggregateRecordsExcludeLookup(
      MemoryPost, { visibility : "PUBLIC"}, req.body.limit, req.body.page, req.body.sort || { "createdAt" : -1 }, { "password": 0, "__v": 0 } );

    return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Arts detail fetched sucessfully", { memories: memories }));
}
catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
};
}

/**
 * Get User post Count
 * @param {*} req
 * @param {*} res
 * @returns
 */
 export const getMemoriesCount = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
              .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
      }
      // fetch arts
      var count = await fetchRecordCount(MemoryPost, req.body.filter);
      // Return
      return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Memories count detail fetched sucessfully", { count: count }));
  }
  catch (err) {
      logger.error("Internal server error:", err);
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
          .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
}

/**
 * Get User post Count
 * @param {*} req
 * @param {*} res
 * @returns
 */
 export const getPublicMemoriesCount = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
              .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
      }
      // fetch arts
    var count = await fetchRecordCount(MemoryPost, { visibility : "PUBLIC"} );
      // Return
      return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Memories count detail fetched sucessfully", { count: count }));
  }
  catch (err) {
      logger.error("Internal server error:", err);
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
          .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
}