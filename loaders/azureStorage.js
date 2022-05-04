/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Azure loader
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import AzureStorageBlob from "@azure/storage-blob";
const { BlobServiceClient } = AzureStorageBlob;
import { CONFIGS } from "../configs/configExport.js";
const { AZURESTORAGECONFIG } = CONFIGS;
import { logger } from "../utils/logger.js";

/**
 * Container should be only 1 time creation not on every new changes
 * or server refresh. We will also check this container, If it is already
 * created we don't need to create a new one, just use already created
 * container.
 */

export default async function makeAzureStorageConnection() {

    // This object will holds all the containerNames and their associated
    // instance of the "containerClient" which you can access on different
    // API endpoints.
    // Syntax example:
    // req.containerInstances.YourContainerName.containerClient
    let containerInstances = {};

    // Create Blob Service Client from Account connection string
    const STORAGE_CONNECTION_STRING = AZURESTORAGECONFIG.STORAGE_CONNECTION_STRING || "";
    // Note - Account connection string can only be used in node.
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);

    // Take the total containers length
    const containerLength = AZURESTORAGECONFIG.STORAGE_CONTAINERS.length;

    // Iteration
    for (let i = 0; i < containerLength; i++) {
        // Create a container
        const containerName = AZURESTORAGECONFIG.STORAGE_CONTAINERS[i];
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Check if container exist ot not
        const isExist = await containerClient.exists();
        logger.info(`${i + 1} - Azure container ${containerName} exist:`, isExist);
        if (!isExist) {
            const createContainerResponse = await containerClient.create();
            logger.info(`${i + 1} - Create container ${containerName} successfully`, createContainerResponse.requestId);
        }
        containerInstances = {...containerInstances, [containerName]: containerClient};
    }

    return containerInstances; // Return containerInstances so we can use on our API routes.
}