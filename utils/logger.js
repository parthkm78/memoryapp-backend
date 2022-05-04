/**********************************************************************
 * Changelog										
 * All notable changes to this project will be documented in this file.	
 **********************************************************************
 *
 * Author             : Parth Mehta
 *
 * Date created       : 04/05/2022
 *
 * Purpose            : Contains the Code for the Logging 
 *
 * Revision History	:
 *
 * Date			Author			Jira			Functionality 
 * 
 **********************************************************************
 */

//IMPORTS
import winston from "winston";
import { CONFIGS } from "../configs/configExport.js";
const { LOGCONFIG } = CONFIGS;

//INITIALIZE LOGGER
export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: LOGCONFIG.FILE_FORMAT }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            filename: LOGCONFIG.FILE,
            json: LOGCONFIG.ISJSON,
            maxsize: LOGCONFIG.FILE_SIZE,
            maxFiles: LOGCONFIG.MAX_FILES,
        }),
        new winston.transports.Console(),
    ]
});