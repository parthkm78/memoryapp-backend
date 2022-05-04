// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 04/05/2022
// *
// * Purpose			: fileupload properties 
// *                     
// * Revision History	:
// *
// * Date			Author			Jira			Functionality 
// * 
// *
// **********************************************************************

export default{
        bufferSize: 4 * 1024 * 1024,// Set the maximum length of a transfer to 4MB.
        maxBuffers: 20, // Set the maximum number of workers that may be used in a parallel transfer.
        containerName : "memoryApp-dev",
        baseUrl : "memories"
}