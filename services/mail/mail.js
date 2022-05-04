/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Mail Utilities
 *
 * Revision History  :
 *
 * Date            Author            Jira          Functionality
 **********************************************************************
 */

// IMPORTS
import sgMail  from "@sendgrid/mail";
import { CONFIGS } from "../../configs/configExport.js";
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../utils/constants.js";
import { logger } from "../../utils/logger.js";
import { successResponse, errorResponse } from "../../utils/response.js";

sgMail.setApiKey(CONFIGS.SMTPCONFIG.SENDGRID_API_KEY);

/**
 * Send mail
 * @returns
 */
export const sendmail = async (
  res,
  mailOptions,
  userEmail,
  reVerification = false,
  passswordUpdate = false
) => {
  await sgMail
    .send(mailOptions)
    .then((res) => {
      logger.info("Email sent sucessfully to " + userEmail);
    })
    .catch((err) => {
      logger.error("services/sendmail: error while sending email:", err);
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
    });
};

/**
 *
 * send mail for forget password
 * @returns
 */
export const sendMailForgetPassword = async (res, mailOptions, userEmail) => {
  await sgMail
      .send(mailOptions)
    .then((res) => {
      logger.info("Email sent successfully to " + userEmail);
    })
    .catch((err) => {
      logger.error("services/sendMailForgetPassword : error while sending email:", err);
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
    });
  return res
    .status(HTTP_STATUS_CODE.OK)
    .json(successResponse("Forgot password email sent to " + userEmail));
};

/**
 *
 * send mail for forget passcode
 * @returns
 */
export const sendMailForgetPassCode = async (res, mailOptions, userEmail) => {
  await sgMail
      .send(mailOptions)
    .then((res) => {
      logger.info("Email sent successfully to " + userEmail);
    })
    .catch((err) => {
      logger.error("services/sendMailForgetPassCode : error while sending email:", err);
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
        .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
    });
  return res
    .status(HTTP_STATUS_CODE.OK)
    .json(successResponse("Forgot passcode email sent to " + userEmail));
};

/**
 * Configure mail for signupCherie
 * @returns
 */
export const signupMailOptions = async (userEmail, verificationCode, userLanguage) => {
    return {
    from: CONFIGS.SMTPCONFIG.EMAIL,
    to: userEmail,
    subject: "MemoryApp - Account Registration Verification",
    html: ``,
  };
};

/**
 * Configure mail for Delete
 * @returns
 */
export const deleteUserMailOptions = async (userEmail, verificationCode, userLanguage) => {
  return {
    from: CONFIGS.SMTPCONFIG.EMAIL,
    to: userEmail,
    subject: 'MemoryApp - Account Delete Verification',
    html: ``,
  };
};

/**
 * Configure mail for Delete
 * @returns
 */
export const updateUserMailOptions = async (userEmail, verificationCode, userLanguage) => {
 return {
    from: CONFIGS.SMTPCONFIG.EMAIL,
    to: userEmail,
    subject: "MemoryApp - Account Update Verification",
    html: ``,
  };
};

/**
 * Configure mail for update password
 * @returns
 */
export const updatePasswordMailOptions = async (
  userEmail,
  verificationLink
) => {
    return {
    from: CONFIGS.SMTPCONFIG.EMAIL,
    to: userEmail,
    subject: "MemoryApp - Password updated",
    html: ``,
  };
};

/**
 * Configure mail for update password
 * @returns
 */
export const updatePassCodeMailOptions = async (
    userEmail,
    verificationLink
) => {
    return {
        from: CONFIGS.SMTPCONFIG.EMAIL,
        to: userEmail,
        subject: "MemoryApp - Passcode updated",
       
    };
};


/**
 * Send an email for forget password
 * @returns
 */
export const forgetPasswordOptions = async (userEmail, verificationLink) => {
  return {
    from: CONFIGS.SMTPCONFIG.EMAIL,
    to: userEmail,
    subject: "MemoryApp - Forgot Password",
    
  };
};

