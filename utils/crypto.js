// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 04/05/2022
// *
// * Purpose			: Contains hash related 
// *                      functions
// *
// * Revision History	:
// *
// * Date			Author			Jira			Functionality 
// * 
// *
// **********************************************************************

import crypto from "crypto";
import bcrypt from "bcrypt";
import { CONFIGS } from "../configs/configExport.js";
const { CRYPTOCONFIG } = CONFIGS;

/**
 * Create Hash Value of Input
 * 
 * @param {string} text -  Text to Hash
 * @returns {string}
 **/
export const createHashVal = async (text, useBcrypt = true) => {
    const salt = await bcrypt.genSaltSync(CRYPTOCONFIG.BCRYPT_SALT_ROUNDS);
    if (useBcrypt)
        return await bcrypt.hashSync(text, salt);
    else
        return await crypto
            .createHash(CRYPTOCONFIG.HASH_ALGORITHM)
            .update(text)
            .digest(CRYPTOCONFIG.DIGEST_ENCODING);
}

/**
 * Generate randombytes
 * 
 * @returns {string}
 **/
export const generateRandomBytes = async () => {
    return await crypto.randomBytes(16).toString(CRYPTOCONFIG.DIGEST_ENCODING);
}

/**
 * Compare Hash
 * 
 * @param {string} plainText
 * @param {string} textHash
 * @returns {boolean}
 **/
export const compareHash = async (plainText, textHash) => {
    return await bcrypt.compare(plainText, textHash);
}
