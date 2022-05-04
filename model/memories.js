/**********************************************************************
 * Changelog                                        
 * All notable changes to this project will be documented in this file.    
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Memories Collection
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality 
 * 
  **********************************************************************
 */

// IMPORTS
import mongoose from "mongoose";

var memoryPostSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    fileType: { type: String },
    fileUrl: { type: String },
    createdAt : { type: Date , default: Date.now },
    visibility :{ type: String,  enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
    description :{ type: String },
});

//Exporting Contract Model
const MemoryPost = mongoose.model("memoryPost", memoryPostSchema);
export default MemoryPost;
