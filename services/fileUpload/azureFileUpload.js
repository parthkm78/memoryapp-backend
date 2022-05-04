
/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Azure file operation
 *
 * Revision History  :
 *
 * Date            Author            Jira          Functionality
 **********************************************************************
 */

import {logger} from "../../utils/logger.js";
import {v4 as uuidv4} from "uuid";
import intoStream from "into-stream";
import { logger } from "./logger.js";
import { getLastSegmentOfBlob} from "../../utils/azureStorage/js";

/**
 * This asynchronous function will upload your Node.js readable stream to Azure blob storage
 * @param containerInstances {Object} - Azure container instances always return the BlockBlobClient instance
 * @param containerName {string} - The name of the container where you want to upload these files
 * @param bufferedFile {Object} - Node.js file in readable stream format
 * @param subDirectory {string} - It represent the subdirectory string that will be append with the "blob"
 * @returns {Promise<*>} - Returns a promise that can be resolved or rejected
 */
 export const uploadBlob = async function(containerInstances, containerName, bufferedFile, subDirectory) {
    // Create a blob name
    
    const uuid = uuidv4();

    const blobName = `${subDirectory}/${uuid}`;

    // Convert a buffer into a Node.js Readable stream
    const stream = intoStream(bufferedFile.buffer);

    // Creates an instance of BlockBlobClient
    const blockBlobClient = containerInstances?.[containerName].getBlockBlobClient(blobName);

    // Set the http headers for the blob
    const blobHeaders = {
        blobHTTPHeaders: { blobContentType: bufferedFile.mimetype }
    };
    try {
        logger.info("------------ Upload Operation Started ------------");

        await blockBlobClient.uploadStream(
            stream,
            FILEUPLOADCONFIG.bufferSize,
            FILEUPLOADCONFIG.maxBuffers,
            blobHeaders
        );

        logger.info(uuid, ` - File ${bufferedFile.originalname} uploaded to Azure Blob Storage.`);

        // Also, read about the issue of Azure storage which automatically returns
        // the encoded URL behind the scenes
        // https://github.com/Azure/azure-sdk-for-net/issues/16460
        return {...blockBlobClient, blobName: blobName};

    } catch (err) {
        // During the upload operation, if there is an error in any of the uploads,
        // we will end the entire request.
        return Promise.reject(err);
    }
}

/**
 * This asynchronous function will delete your provided blobUrl from the Azure storage
 * @param containerInstances {Object} - Azure container instances
 * @param containerName {string} - The name of the container where you want to upload these files
 * @param blobUrl {string} - It represent the old blobURL
 * @param subDirectory {string} - This represents the subdirectory string that preceded the last part of the URL
 * @returns {Promise<*>} - Returns a promise that can be resolved or rejected
 */
export const deleteBlob = async function(containerInstances, containerName, blobUrl, subDirectory) {
    try {
        // Get the old Blob Name
        const oldBlobName = getLastSegmentOfBlob(blobUrl);

        // Creates an instance of old BlockBlobClient
        const blockBlobClientOld = containerInstances?.[containerName].getBlockBlobClient(`${subDirectory}/${oldBlobName}`);

        // If Blob exist then delete it. otherwise cancel the request
        const isExist = await blockBlobClientOld.exists();

        if (isExist) {
            const blobDeleteResponse = await blockBlobClientOld.delete();
            logger.info("Blob exist and deleted with request id :" + blobDeleteResponse.clientRequestId);
        } else {
            logger.info("Blob exist", isExist);
        }
    } catch (err) {
        logger.info("Error while deleting blob from the container");
        return Promise.reject(err);
    }
}