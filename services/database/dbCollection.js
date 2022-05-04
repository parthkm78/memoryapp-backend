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
import mongoose from "mongoose";
import { logger } from "../../utils/logger.js";
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../utils/constants.js";
import { errorResponse } from "../../utils/response.js";

/**
 * Delete collection records
 * @param model
 * @param  deleterQuery  - Query Condition to find the Data
 * @returns
 */
export const deleteRecords = async (model, deleterQuery) => {
  await model.deleteMany(deleterQuery)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      logger.error("dbCollection/deleteRecords : Error while deleting token information", err);
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
    });
}

/**
 * Update collection record
 * @param  filterQuery  - Query Condition to find the Data
 * @param  updateQuery  - Update Strategy Condition to be Applied on the rows
 * @param  upsertOption - Boolean
 * @returns
 */
export const updateRecord = async (model, filterQuery, updateQuery, upsertOption) => {
  return await model.findOneAndUpdate(filterQuery, updateQuery, upsertOption)
}

/**
 * Fetch collection record
 * @param  model - collection
 * @param  filterQuery - Query Condition to find the Data
 * @returns
 */
export const fetchRecord = async (model, filterQuery) => {
  return await model.findOne(filterQuery)
}

/**
 * Fetch collection record
 * @param  model - collection
 * @param  filterQuery - Query Condition to find the Data
 * @param projection
 * @param excludeFields
 * @returns
 */
export const fetchRecordAndExcludeFields = async (model, filterQuery, projection, excludeFields) => {
  return await model.findOne(filterQuery, projection, excludeFields)
}

/**
 * Delete collection record
 * @param  model - collection
 * @param  filterQuery - Query Condition to find the Data
 * @param condition
 * @returns
 */
export const updateManyRecords = async (model, filterQuery, condition) => {
  await model.updateMany(filterQuery, condition);
}

/**
 * Save collection record
 * @param model - collection
 * @returns
 */
export const saveRecord = async (model, res) => {
  return await model.save()
    .then((response) => {
      logger.info("model saved");
      return response;
    })
    .catch((err) => {
      logger.error("dbCollection/saveRecord : Error while saving model information", err);
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
    });
}

/**
 * Fetch collection record count
 * @param  model - collection
 * @param  filterQuery - Query Condition to find the Data
 * @returns
 */
export const fetchRecordCount = async (model, filterQuery = {}) => {
  return await model.countDocuments(filterQuery);
}

/**
 * Fetch collection record with sorting and pagination
 * @param  model - collection
 * @param  filterQuery - Query Condition to find the Data
 * @param limit
 * @param page
 * @param sort
 * @param listOfExcludeFields
 * @returns
 */
export const fetchRecordSortPagi = async (model, filterQuery = { isDeleted: false }, limit = 10, page = 1, sort = { createdAt: -1 }, listOfExcludeFields = { __v: 0 }) => {
  return await model.find(filterQuery, listOfExcludeFields)
    .limit(limit)
    .skip((limit * page) - limit)
    .sort(sort);
}

/**
 * Update collection record
 * @param model - collection
 * @param query
 * @param field
 * @param res
 * @returns
 */
export const updateSingleRecord = async (model, query, field, res) => {
  await model.updateOne(query, field)
    .then((response) => {
      logger.info("model saved");
      return response;
    })
    .catch((err) => {
      logger.error("dbCollection/updateSingleRecord : Error while updating model information", err);
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
    });
}

/**
 * Generate Unique MongoDB Identifier
 * @returns
 */
export const generateMongoDBIdDB = () => {
  const newId = new mongoose.Types.ObjectId();
  return newId.toHexString();
}

/**
 * Fetch collection record with aggregations
 * @param  model - collection
 * @param  filterQuery - Query Condition to find the filter Data
 * @param limit
 * @param page
 * @param sort
 * @param returnFields
 * @returns
 */
 export const aggregateRecordsExcludeLookup = async (model, filterQuery = { isDeleted: false },
  limit = 10, page = 1, sort = { createdAt: -1 }, returnFields = { __v: 0 },
  addFields = {}) => {

  return await model.aggregate([
    { "$match": filterQuery },
    {
      $addFields: addFields
    },
    { "$project": returnFields },
    { $sort: sort }, // Latest first
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ])
}

