/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : redis loader
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import { CONFIGS } from "../configs/configExport.js";
import { logger } from "../utils/logger.js";
const { REDISCONFIG } = CONFIGS;
import redis from "redis";

/**
 *  Initialize redis-server for storing and getting cache from redis database
 */
export default async () => {
    try {
        // Create Client for redis-server giving host and port so we can use earilier stored data and also store new data
        const client = redis.createClient({ host: REDISCONFIG.HOST, port: REDISCONFIG.PORT });
        // global['redisClient'] = client;

        //Error occurs if redis-server is not connected
        client.on("error", (err) => {
            logger.info(`Redis Error: ` + err)
        })

        //redis-server is ready for get and set data
        client.on("ready", () => {
            logger.info(`redis have ready !`)
        })

        //redis-server is connected
        client.on("connect", () => {
            logger.info(`connect redis success`)
        })
        return client;
    }
    catch (err) {
        return err
    }
}