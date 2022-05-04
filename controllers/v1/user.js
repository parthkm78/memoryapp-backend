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
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../utils/constants.js";
import User from "../../model/user.js";
import { logger } from "../../utils/logger.js";
import { compareHash, createHashVal, generateRandomBytes } from "../../utils/crypto.js";
import { forgetPasswordOptions,  sendmail,  sendMailForgetPassword,signupMailOptions, updatePasswordMailOptions } from "../../services/mail/mail.js";
import {   configureForgetPasswordLink, addMemoryObj, configureVerificationLink,   insertTokenObj,  insertUserObj,  insertUserByAdminObj,  lockDate,  updatePasswordObj,  updateUserObj, updatloginAttempts, userInfo
} from "../../utils/object.js";
import { deleteRecords, fetchRecord, fetchRecordAndExcludeFields, fetchRecordCount, fetchRecordSortPagi, saveRecord, updateManyRecords, updateSingleRecord } from "../../services/database/dbCollection.js";
import { saveRecordSession, updateSingleRecordSession } from '../../services/database/dbCollectionSession.js'
import validator from 'express-validator';
import { generateToken } from "../../services/auth/auth.js"
import { v4 as uuidv4 } from "uuid";
import intoStream from "into-stream";
import { getLastSegmentOfBlob } from "../../utils/azureStorage.js";
import { CONFIGS } from "../../configs/configExport.js";
const { FILEUPLOADCONFIG } = CONFIGS;
const { validationResult } = validator;


/**
 * signup new user & send verification link
 *
 * @param {object} req The request object
 * @param {object} res The response object
 **/
export const signup = async (req, res) => {
  let session = {}
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }))
    }
    const opt = await global['mongoConn'].startSession();
  
    // Usually roles are OPERATOR, SUPERVISOR, SUPER ADMIN
    if (req.body.role == "OPERATOR" || req.body.role == "SUPERVISOR" || req.body.role == "SUPER ADMIN") {
      adminFlag = true;
    }
    
    let verificationToken = '';
    let user;

    /* Transection management
      If api hit with same details twice at same time then it create duplicate records
    */
    const transactionResults = await session.withTransaction(async () => {
      // create and save user
      user = await new User(await insertUserObj(req, adminFlag));

      await saveRecordSession(user, res, opts);
      // generate token and save
      verificationToken = await generateRandomBytes();
      // generate hash value
      const hashToken = await createHashVal(verificationToken);
      logger.info("Hash token generated:")

      // create and save token object
      var token = new Token(insertTokenObj(user._id, hashToken));
      await saveRecordSession(token, res, opts);
    }, TRANSACTION_OPTIONS);

    // check transection result and admin flag
    if (transactionResults) {
      const verificationLink = configureVerificationLink(user._id, verificationToken)
      logger.info("verification link: " + verificationLink);
      // configure mail options
      const mailObj = await signupMailOptions(user.email, verificationLink)
      // send mail with verification link
      await sendmail(res, mailObj, user.email);
    } else {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
    }
  } catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  } finally {
    if (session) {
      session.endSession();
    }
  }
};


/**
 * signup By Admin for new user
 *
 * @param {object} req The request object
 * @param {object} res The response object
 **/
export const signupByAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }
      if (req.body.role && req.body.role !== "OPERATOR" && req.body.role !== "SUPERVISOR" && req.body.role !== "SUPER ADMIN") {
        return res
            .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
            .json(errorResponse("Access Denied"));
      }
      // create and save user
      let user = await new User(await insertUserByAdminObj(req));
      await saveRecord(user, res);
    return res.status(HTTP_STATUS_CODE.CREATED).json(successResponse("SignUp successfully"));
  } catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  }
};




/**
 * Update password
 *
 * @param {object} req The request object
 * @param {object} res The response object
 **/
export const updatePassword = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    let user = await fetchRecord(User, { email: req.body.email.toLowerCase() })

    // check if user is exists or not
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("The user is not exists"));
    }

    // comapre user's password if user is find in above step
    if (!await compareHash(req.body.oldPassword, user.password)) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("Wrong Password!"));
    }

    // check if oldPassword == NewPassword
    if (await compareHash(req.body.newPassword, user.password)) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("The new password matched with old password"));
    }

    let passObj = await updatePasswordObj(user, req.body.newPassword);

    await updateSingleRecord(User, { email: req.body.email.toLowerCase() }, { $set: passObj }, res)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        logger.error("Error while updating user password", err);
        return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
          .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
      });

    // configure mail options
    var mailObj = await updatePasswordMailOptions(user.email, "")
    // send mail
    await sendmail(res, mailObj, user.email, false, true);
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

/**
 * login for exisiting user
 *
 * @param {object} req The request object
 * @param {object} res The response object
 **/
export const login = async (req, res) => {
  let session = {}
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }
    //fetch existing record
    let user = await fetchRecord(User, { email: req.body.email.toLowerCase() });
    
      // if existing user not found
      if (!user) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("The email address " + req.body.email + " is not associated with any account. please check and try again!"));
      }
      // check user is verified or not
      if (!user.isVerified) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("Your Email has not been verified.", { "isVerified": user.isVerified }));
      }
      // check user is verified or not
      if (user.isDeleted) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("This account is deleted."));
      }
      //check user account is lock or not or After 30 mins account unlock
      if (user.loginAttempts > 5) {
        var currentDate = new Date();
        if (((currentDate - user.lockUntil) / 60000) <= 30) {
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("You have accessed attempt to login in the application. Your account will be temporarily locked for 30 minutes. Alternatively you can try to recover password or contact support"));
        } else {
          let obj = await updatloginAttempts(user, 0);
          user.loginAttempts = 0;
          await updateSingleRecord(User, { email: req.body.email.toLowerCase() }, { $set: obj }, res);
        }
      }
      // fetch latest user object and password check
      if (!await compareHash(req.body.password, user.password)) {
        // login attempt limit check
        if (user.loginAttempts >= 5) {
          // add current Date Time in user document
          let obj = await lockDate(new Date(), user.loginAttempts + 1);
          await updateSingleRecord(User, { email: req.body.email.toLowerCase() }, { $set: obj }, res);
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("You have accessed attempt to login in the application. Your account will be temporarily locked for 30 minutes. Alternatively you can try to recover password or contact support"));
        }
        let loginAttempts = user.loginAttempts + 1;
        let obj = await updatloginAttempts(user, loginAttempts);
        //update user login attempt
        await updateSingleRecord(User, { email: req.body.email.toLowerCase() }, { $set: obj }, res);
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("Invalid credential!"));
      }

      // update loginAttempt to 0 after successful login
      let obj = await updatloginAttempts(user, 0);
      //update user login attempt
      if (req.body.deviceToken) {
        obj.fcmToken = req.body.deviceToken
      }
      await updateSingleRecord(User, { email: req.body.email.toLowerCase() }, { $set: obj }, res);

      /*
      * Call token generation service
      */
      logger.info("Calling token Generation API")
      let tokenObj = await generateToken(req.body.email.toLowerCase(), req.body.password, user._id, "NORMAL", req.body.deviceToken, res);
      // check error in response
      if (!tokenObj.data || tokenObj.data.status == "error") {
        return res
          .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
          .json(errorResponse("Error while calling auth service"));
      }

      let returnObj = await userInfo(user);
      // first login
      if (user.firstLogin) {
        await updateSingleRecord(User, { email: req.body.email.toLowerCase() }, { $set: { firstLogin: false } }, res);
        const profileCreationDate = moment(user.createdAt).format('DD/MM/YYYY');
        returnObj.firstLogin = true;
      }
      return res.status(HTTP_STATUS_CODE.OK)
        .json(successResponse("Login Successfully", { token: tokenObj.data.data.token, user: returnObj }));
    
  } catch (err) {
    logger.error("Failed to Complete the Login Process: " + err.message);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  } finally {
    session.endSession();
  }
};

/**
 * update forget password
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns
 */
export const newPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }
    // verify link
    const { userId, token } = req.params;

    let tokenObj = await fetchRecord(Token, { _userId: userId });

    // check token object exists
    if (!tokenObj) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json(errorResponse("We were unable to find a user for this verification. Please SignUp!"));
    }
    // compare token
    if (!tokenObj.token || !await compareHash(token, tokenObj.token)) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("Your verification link may have expired. Please click on resend for verify your Email."));
    }
    var user = await fetchRecord(User, { _id: tokenObj._userId })

    // check if user is exists or not
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("The user is not exists"));
    }

    // check user is verified or not
    if (!user.isVerified) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("Your Email has not been verified."));
    }

    //update new password
    let passwordObj = await updatePasswordObj(user, req.body.newPassword);
    await updateSingleRecord(User, { email: user.email.toLowerCase() }, { $set: passwordObj }, res)
    return res.
      status(HTTP_STATUS_CODE.OK)
      .json(successResponse("Password successfully updated!", { user: req.body.email }));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

/**
 * verify verification link
 *
 * @param {object} req The request object
 * @param {object} res The response object
 **/
export const verifyEmail = async (req, res) => {
  try {
    const { userId, token } = req.params;

    let tokenObj = await fetchRecord(Token, { _userId: userId });

    // check token object exists
    if (!tokenObj) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json(errorResponse("We were unable to find a user for this verification. Please SignUp!"));
    }
    // compare token
    if (!tokenObj.token || !await compareHash(token, tokenObj.token)) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("Your verification link may have expired. Please click on resend for verify your Email."));
    }

    else {
      var user = await fetchRecord(User, { _id: tokenObj._userId })

      // not valid user
      if (!user) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse("We were unable to find a user for this verification. Please SignUp!"));
      }

      // user is already verified
      else if (user.isVerified) {
        return res.status(HTTP_STATUS_CODE.OK).json(successResponse("User has been already verified. Please Login"));
      }
      // verify user
      else {
        // change isVerified to true
        user.isVerified = true;
        await saveRecord(user, res);
        // account successfully verified
        return res.status(HTTP_STATUS_CODE.OK).json(successResponse("Your account has been successfully verified"));
      };
    }
  } catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

/**
 * resend verification link
 *
 * @param {object} req The request object
 * @param {object} res The response object
 **/
export const resendVerificationLink = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    var user = await fetchRecord(User, { email: req.body.email.toLowerCase() })
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(successResponse("We were unable to find a user with that email. Make sure your Email is correct!"));
    }
    // user has been already verified
    else if (user.isVerified) {
      return res.status(HTTP_STATUS_CODE.OK).json(successResponse("This account has been already verified. Please log in."));
    }
    else {
      // delete existing verification links
      await deleteRecords(Token, { _userId: user._id })
      // generate token and save
      var token = await generateRandomBytes();
      // generate hash
      const hashToken = await createHashVal(token);
      // create token object
      var tokenObj = new Token({ _userId: user._id, token: hashToken });
      // save token object
      await saveRecord(tokenObj, res);
      // verification link
      const verificationLink = configureVerificationLink(user._id, token);
      logger.info("verification link: " + verificationLink);

      // configure mail options
      var mailObj = await signupMailOptions(user.email, verificationLink)
      // send mail
      await sendmail(res, mailObj, user.email, true, false);
    }
  } catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

/**
 * Forgot Password
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const forgetPassword = async function (req, res) {
  try {
    const errors = servalidationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    var user = await fetchRecord(User, { email: req.body.email.toLowerCase() })
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("We were unable to find a user with that email. Make sure your Email is correct!"));
    }
    // delete existing verification links
    await deleteRecords(Token, { _userId: user._id })

    var token = await generateRandomBytes();
    // generate hash
    const hashToken = await createHashVal(token);
    // create token object
    var tokenObj = new Token({ _userId: user._id, token: hashToken });
    // save token object
    await saveRecord(tokenObj, res);
    // verification link
    const verificationLink = configureForgetPasswordLink(user._id, token);
    logger.info("verification link: " + verificationLink);

    // configure mail options
    var mailObj = await forgetPasswordOptions(user.email, verificationLink)
    // send mail
    await sendMailForgetPassword(res, mailObj, user.email);
  } catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };
};

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

      try {
        // Get the old Blob Name
        const oldBlobName = getLastSegmentOfBlob(user.file);
        let streamProfile ;
        
       if(req.memoryType.toLowerCase() == "text")
       {
        streamProfile = intoStream(req.memoryDescription);
       }else{
        streamProfile = intoStream(eq.files.memoryFile[0].buffer);
       }

      // upoad file and get URL
      const blockBlobClient = await uploadBlob(containerInstances, FILEUPLOADCONFIG.containerName, streamProfile, file, FILEUPLOADCONFIG.baseUrl+ `/${user._id}/${uuidv4()}`);
      let updateObj = await addMemoryObj(user, req.body, blockBlobClient.url);
    
      // add memory related details
      await updateSingleRecord(User, { _id: req.body.userId }, { $set: updateObj }, res);

      } catch (err) {
        logger.error("Error while deleting container:", err)
        return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
          .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
      }
        
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

/**
 * Delete Users
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    // Fetch Existing User
    let user = await fetchRecord(User, { _id: req.body.userId });
    if (user.isDeleted) {
      logger.info("User already deleted")
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("User already deleted"));
    }
    // check User has permission or not
    if (req.body.email != user.email) {
      logger.info("User's email id not associcated with Id in request. Access Denined")
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse("Access Denined"));
    }

    // Soft Delete Users -> update isDeleted flag
    await updateSingleRecord(User, { _id: req.body.userId }, { $set: { isDeleted: true } }, res);
    return res.
      status(HTTP_STATUS_CODE.OK)
      .json(successResponse("Users deleted successfully"));
  }
  catch (err) {
    logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  };

};

/**
 * Delete Users
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
        .json(errorResponse(ERROR_MESSAGE.UNPROCESSABLE_ENTITY, { errors: errors.array() }));
    }

    // Soft Delete Users -> update isDeleted flag
    await updateManyRecords(User, { _id: { $in: req.body.users } }, { $set: { isDeleted: true } });
    return res.
      status(HTTP_STATUS_CODE.OK)
      .json(successResponse("Users deleted successfully"));
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


