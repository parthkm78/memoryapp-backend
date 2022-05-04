/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Express loader
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import { logger } from "../utils/logger.js";
import userRoute from "../routes/api/v1/user.js";
import memoryRoute from "../routes/api/v1/memories.js";
import userDetailRoute from "../routes/api/v1/userDetail.js";
import swaggerUI from "swagger-ui-express";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { CONFIGS } from "../configs/configExport.js";
const { SERVERCONFIG } = CONFIGS;

/**
 *  Initialize https
 */
export default async (specs, containerInstances) => {
    const app = express();
    app.use(helmet()); // adding Helmet to enhance API's security
    app.use(cors());
    app.use(compression()); // Compress all HTTP responses
    app.use(express.json());
    // app.use(morgan("combined")); // adding morgan to log HTTP requests

    //Define the API Routes
    // Memories route
    app.use("/user/post",function(req, res, next) {
        req.containerInstances = containerInstances; // assign containerInstances to our request
        next(); // After attaching Azure containerInstances go to next() middleware i.e. router.
      }, memoryRoute);
    
    // user CRUD operations
    app.use("/user", function(req, res, next) {
        req.containerInstances = containerInstances; // assign containerInstances to our request
        next(); // After attaching Azure containerInstances go to next() middleware i.e. router.
    }, userRoute);
    
    // User details related APIs
    app.use("/user", userDetailRoute);

    // swegger api end point
    app.use("/user/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
    //Express App Listening on the Given Port
    app.listen(SERVERCONFIG.port, () => {
        logger.info(`App listening at ` + SERVERCONFIG.url)
    })

}
