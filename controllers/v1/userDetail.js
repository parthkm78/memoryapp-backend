/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 04/05/2022
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
import moment from "moment";
import { ERROR_MESSAGE, HTTP_STATUS_CODE, TRANSACTION_OPTIONS } from "../../utils/constants.js";
import User from "../../model/user.js";
import { logger } from "../../utils/logger.js";
import { fetchRecord, fetchRecordAndExcludeFields, fetchRecordCount, fetchRecordSortPagi } from "../../services/database/dbCollection.js";
import { updateSingleRecordSession } from '../../services/database/dbCollectionSession.js'

/**
 * Fetch user detail
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const fetchDetail = async function (req, res) {
  try {
    var user = await fetchRecordAndExcludeFields(User, { email: req.body.email.toLowerCase() }, { accountType: 1, userName: 1, firstName: 1, lastName: 1, overview: 1, companyName: 1, email: 1, isVerified: 1, role: 1, loginAttempts: 1, lockUntil: 1, country: 1, contactNo: 1, createdBy: 1, createdAt: 1, updatedBy: 1, updatedAt: 1, isDeleted: 1, memoryFile: 1, coverImage: 1, socialMediaType: 1, socialMediaId: 1, firstLogin: 1, settings: 1
    }, { password: 0, __v: 0 })
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("We were unable to find a user with that email. Make sure your Email is correct!"));
    }

    return res.
      status(HTTP_STATUS_CODE.OK)
      .json(successResponse("User detail fetched Successfully", { user: user }));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};


/**
 * Fetch user detail
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const fetchDetailByUserId = async function (req, res) {
  try {
    const { role, idOfUser } = req.body;

    if (role && role !== "OPERATOR" && role !== "SUPERVISOR" && role !== "SUPER ADMIN" && role !== "ADMIN") {
      return res
          .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
          .json(errorResponse("Access Denied"));
    }

    if (!idOfUser) {
        return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY).json(errorResponse("idOfUser is required"));
    }

    const user = await fetchRecordAndExcludeFields(User, { _id: idOfUser }, { accountType: 1, userName: 1,
      firstName: 1, lastName: 1, overview: 1, companyName: 1, email: 1, isVerified: 1, role: 1,
      loginAttempts: 1, lockUntil: 1, country: 1, contactNo: 1, createdBy: 1, createdAt: 1, updatedBy: 1,
      updatedAt: 1, isDeleted: 1, memoryFile: 1, coverImage: 1, socialMediaType: 1,
      socialMediaId: 1, firstLogin: 1, settings: 1
    }, { password: 0, __v: 0 })

    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("We were unable to find a user"));
    }

    return res.
      status(HTTP_STATUS_CODE.OK)
      .json(successResponse("User detail fetched Successfully", { user: user }));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

/**
 * Get Users Count
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUsersCount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    if (req.body.role !== "OPERATOR" && req.body.role !== "SUPERVISOR" && req.body.role !== "SUPER ADMIN") {
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse("Access Denied"));
    }

    // search
    let search;
    if (!req.body.search || req.body.search == "") {
      search = {};
    }
    else {
      let regex = new RegExp(req.body.search, 'i');
      search = { $or: [{ email: regex }, { userName: regex }, { companyName: regex }] };
    }
    let filter;
    // fetch arts
    if (!req.body.filter || req.body.filter == "") {
      filter = {};
    }
    else {
      filter = req.body.filter
    }
    let filterQuery = { $and: [search, filter] };
    // fetch arts
    var count = await fetchRecordCount(User, filterQuery);
    // Return
    return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Users count detail fetched sucessfully", { count: count }));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
}

/**
 *  Search Users -> used for partial search to fetch users from userName, firstName and lastName
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const searchUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }
    let regex = new RegExp(req.body.filter, 'i');
    let filter = {
      $or: [{ userName: regex }, { firstName: regex }, { lastName: regex }, { companyName: regex }, { email: regex }]
    };
    // Search
    let users = await fetchRecordSortPagi(User, filter, req.body.limit, req.body.page, req.body.sort, req.body.returnFields);

    // Return
    return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Users detail fetched successfully", { users: users }));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

/**
 *  Fetch Users
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }


    if (req.body.role !== "OPERATOR" && req.body.role !== "SUPERVISOR" && req.body.role !== "SUPER ADMIN") {
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse("Access Denied"));
    }

    // search
    let search;
    if (!req.body.search || req.body.search == "") {
      search = {};
    }
    else {
      let regex = new RegExp(req.body.search, 'i');
      search = { $or: [{ email: regex }, { userName: regex }, { companyName: regex }] };
    }
    let filter;
    // fetch arts
    if (!req.body.filter || req.body.filter == "") {
      filter = {};
    }
    else {
      filter = req.body.filter
    }
    let filterQuery = { $and: [search, filter] };
    var users = await fetchRecordSortPagi(User, filterQuery, req.body.limit, req.body.page, req.body.sort, req.body.excludeFields);

    // Return
    return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Users detail fetched sucessfully", { users: users }));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
}


/**
 *  Update User
 * @param {*} req
 * @param {*} res
 * @returns
 */
 export const updateUser = async (req, res) => {
  let session = {}
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    // Fetch Existing User
    let user = await fetchRecord(User, { _id: req.body.userId })
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("The User does not exists"));
    }

    // check User has permission or not
    if (req.body.role != "ADMIN" && req.body.email != user.email) {
      logger.info("User's email id not associcated with Id in request. Access Denined")
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("Access Denined"));
    }

    let updateObj = await updateUserObj(user, req.body);
    const profileCreationDate = moment(new Date()).format('DD/MM/YYYY');
    session = await global['mongoConn'].startSession();
    const opts = session;
    const transactionResults = await session.withTransaction(async () => {
      await updateSingleRecordSession(User, { _id: req.body.userId }, { $set: updateObj }, res, opts);
    }, TRANSACTION_OPTIONS);
    if (transactionResults) {
      return res.status(HTTP_STATUS_CODE.OK).json(successResponse("User detail updated successfully"));
    } else {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("Data save reverted successfully"));
    }
  } catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  } finally {
    session.endSession();
  }
};