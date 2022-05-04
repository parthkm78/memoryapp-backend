/**********************************************************************
 * Changelog                                        
 * All notable changes to this project will be documented in this file.    
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Redis Server Service
 *
 * Revision History  :
 *
 * Date            Author            Jira          Functionality 
 **********************************************************************
 */

// IMPORTS
import { logger } from "../../utils/logger.js";

/**
 * set redis value in Key and Value pair 
 * @param {string} key 
 * @param {string} value 
 * @param {number} TTL in minutes
 * @returns 
 */
export const setRedisValue = (key, value) => { //TTL = 0
    return new Promise((resolve, reject) => {
        global['redisClient'].set(key, JSON.stringify(value), (err, result) => {
            if (err) {
                reject(err);
            }
            // if (TTL) global['client'].expire(key, TTL * 60);
            resolve(result);
        })
    })
}

/**
 * get redis value from key
 * @param {string} key 
 * @returns 
 */
export const getRedisValue = (key) => {
    return new Promise((resolve, reject) => {
        global['redisClient'].get(key, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(result));
        })
    })
}

/**
 * delete redis value from key
 * @param {string} key 
 * @returns 
 */
export const deleteRedisValue = (key) => {
    return global['redisClient'].keys(`*${key}*`, function (err, keys) {
        if (err) return logger.info(err);
        for (var i = 0, len = keys.length; i < len; i++) {
            global['redisClient'].del(keys[i], function (error, response) {
                if (error) return logger.info(error);
                if (response == 1) {
                    logger.info("Deleted Successfully!")
                } else {
                    logger.info("deleteRedisValue : Cannot delete")
                }
            })
        }
    });
}
