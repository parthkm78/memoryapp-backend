/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : Swagger loaders
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

//IMPORTS
import swaggerJsDoc from "swagger-jsdoc";
import { CONFIGS } from "../configs/configExport.js";
const { SWAGGERCONFIG } = CONFIGS;

/**
*  Initialize Swagger configuration
*/
export default async () => {

    // Swagger options
    const swaggerOptions = {
        definition: {
            openapi: SWAGGERCONFIG.open_api_version,
            info: {
                title: SWAGGERCONFIG.title,
                version: SWAGGERCONFIG.version,
                description: SWAGGERCONFIG.description,
            },
            servers: [
                {
                    url: SWAGGERCONFIG.url,
                },
            ]
        },
        apis: SWAGGERCONFIG.apis,
    }
    return swaggerJsDoc(swaggerOptions);
}