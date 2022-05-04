/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/04/2022
 *
 * Purpose           : Load all loaders
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import expressLoader from "./express.js";
import mongooseLoader from "./mongoose.js";
import swaggerLoader from "./swagger.js";
import { logger } from "../utils/logger.js"
import makeAzureStorageConnection from "./azureStorage.js";

/**
 *  Load all loaders
 */
export default async (app) => {
    // AzureContainer instances
    let containerInstances = null;
    try {
    // mongodb
    const mongoConnection = await mongooseLoader();
    logger.info('MongoDB Initialized');
    // swagger config
    const specs = await swaggerLoader();
    // azure storage config
    containerInstances = await makeAzureStorageConnection();
    // express https
    await expressLoader(specs, containerInstances);
    logger.info('Express Initialized');
    //redis
    const redisConnection = await redisLoader()
    global['redisClient'] = redisConnection;
    logger.info('Redis connected on ' + redisConnection.address);
    
    } catch (err) {
        logger.error("Error in making connection with Azure storage:", err.message);
    }
}