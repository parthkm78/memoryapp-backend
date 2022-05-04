/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Redis Fetch
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import { HTTP_STATUS_CODE } from "../../utils/constants.js";
import { getRedisValue } from "../../services/redis/redis.js";
import { successResponse } from "../../utils/response.js";

/**
 * redisGetArtsCount function is use to get getArtsCountParSearch API data if Key match
 *
 * @param {object} request The request object
 * @param {object} response The response object
 * @param {object} next The next object
 **/
export const redisGetMemoriesCount = async (request, response, next) => {
    if (global['redisClient'].connected) {
        const resp = await getRedisValue(`/post/public/count/${JSON.stringify(filter)}/${request.body.search}`)
        if (resp !== null) {
            return response.
                status(HTTP_STATUS_CODE.OK)
                .json(successResponse("Memories count detail fetched sucessfully", { count: resp }));
        } else {
            next();
        }
    } else {
        next();
    }
}

/**
 * redisGetArts function is use to get getArtsParSearch API data if Key match
 *
 * @param {object} request The request object
 * @param {object} response The response object
 * @param {object} next The next object
 **/
export const redisGetMemories = async (request, response, next) => {
    if (global['redisClient'].connected) {
        let filter = request.body.filter || {};
        const resp = await getRedisValue(`/post/public/list/${request.body.limit}/${request.body.page}/${JSON.stringify(request.body.sort)}/${JSON.stringify(filter)}/${request.body.search}`)
        if (resp !== null) {
            return response.
                status(HTTP_STATUS_CODE.OK)
                .json(successResponse("Memories detail fetched sucessfully", { arts: resp }));
        } else {
            next();
        }
    } else {
        next();
    }
}
