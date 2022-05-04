
/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : User collection operations Utilities
 *
 * Revision History  :
 *
 * Date            Author            Jira          Functionality
 **********************************************************************
 */

// IMPORTS
import { createHashVal } from "./crypto.js";
import { CONFIGS } from "../configs/configExport.js";
const { SERVERCONFIG } = CONFIGS;

/**
 * Configure User object for insertion
 * @param {*} req - request object
 * @param isSignUpWithEmail
 * @returns
 */
export const insertUserObj = async (req, isSignUpWithEmail) => {
    return {
        email: req.body?.email?.toLowerCase(),
        password: await createHashVal(req.body.password),
        contactNo: req.body?.contactNo,
        isEmailVerified: !!isSignUpWithEmail,
        isMobileVerified: !isSignUpWithEmail,
        fcmToken: req.body?.deviceToken,
        deviceId: req.body?.deviceId,
        isVerified: true
    };
}

/**
 * Configure User object for insertion
 * @param {*} req - request object
 * @returns
 */
export const insertUserByAdminObj = async (req) => {
    return {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.userEmail.toLowerCase(),
        password: await createHashVal(req.body.password),
        country: req.body.country,
        contactNo: req.body.contactNo,
        createdBy: req.body.userId,
        isVerified: true
    };
}

/**
 * Configure User object for updation
 * @param {*} oldObj
 * @param newObj
 * @param res
 * @returns
 */
export const updateUserObj = async (oldObj, newObj, res) => {
    let obj = {
        country: newObj.country || oldObj.country,
        userName: newObj.userName || oldObj.userName,
        overview: newObj.overview || oldObj.overview,
        name: newObj.name || oldObj.name,
        isEmailVerified: newObj.isEmailVerified || oldObj.isEmailVerified,
        updatedAt: Date.now()
    };

    let settingsObj = {
        language: newObj.settings?.language || oldObj.settings.language 
    };

    // add settings object
    obj.settings = settingsObj;

    return obj;
}

/**
 * Configure User object for updation
 * @param {*} oldObj
 * @param newObj
 * @param res
 * @returns
 */
 export const addMemoryObj = async ( userId, memoryData, memoryFileUrl) => {
    return {
        fileType: memoryData.fileType,
        fileUrl: memoryData.memoryFileUrl,
        visibility : memoryData.visibility,
        description : memoryData.description,
        _userId :userId
    };
}


/**
 * Configure Token object for insertion
 * @param email
 * @param code
 * @param type
 * @returns
 */
export const insertTokenObj = (email, code, type) => {
    return {
        email: email,
        code: code,
        type: type,
    };
}

/**
 * Configure Verification link
 * @param {*} userId - id of User
 * @param {*} verificationToken - token in hash format
 * @returns
 */
export const configureVerificationLink = (userId, verificationToken) => {
    return SERVERCONFIG.url + "user/" + userId + "/verifyEmail/" + verificationToken;
}

/**
 * Configure Forget password link
 * @param {*} userId - id of User
 * @param {*} verificationToken - token in hash format
 * @returns
 */
export const configureForgetPasswordLink = (userId, verificationToken) => {
    return SERVERCONFIG.url + "user/" + userId + "/forgetPassword/" + verificationToken;
}

/**
 * Configure new password
 * @param exObj
 * @param {*} password - token in hash format
 * @returns
 */
export const updatePasswordObj = async (exObj, password) => {
    let hashPass = await createHashVal(password);
    let obj = {
        password: hashPass,
    }
    return obj;
}

/**
 * Configure update loginAttempts object
 * @param {*} exobj - id of User
 * @param {*} loginAttempts - count of invalid login
 * @returns
 */
export const updatloginAttempts = async (exObj, loginAttempts) => {
    let obj = {
        loginAttempts: loginAttempts,
    }
    return obj;
}

/**
 * Successful login object
 * @param {*} exObj
 * @returns
 */
export const userInfo = async (exObj) => {
    let obj = {
        userName: exObj.userName,
        firstName: exObj.firstName,
        lastName: exObj.lastName,
        email: exObj.email,
        contactNo: exObj.contactNo,
        name: exObj.name,
        country: exObj.country,
        userId: exObj._id,
        role: exObj.role,
        firstLogin: exObj.firstLogin,
        isVerified: exObj.isVerified,
        settings: exObj.settings,
        isEmailVerified: exObj.isEmailVerified,
        isMobileVerified: exObj.isMobileVerified,
        createdAt: exObj.createdAt
    }
    return obj;
}

/**
 * lock account date time
 * @param {*} recentDate
 * @returns
 */
export const lockDate = async (currentDate, loginAttempt) => {
    let obj = {
        lockUntil: currentDate,
        loginAttempts: loginAttempt
    }
    return obj;
}
