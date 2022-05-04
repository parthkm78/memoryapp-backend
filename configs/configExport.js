/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Environment config
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import ENVCONFIG from "./env/env.js"

import * as dev from "./env/dev.js";
import * as qa from "./env/qa.js";
import * as prod from "./env/prod.js";

export const CONFIGS =   (ENVCONFIG.env == "dev") ? dev : (ENVCONFIG.env == "qa")? qa : prod;