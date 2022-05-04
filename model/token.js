/**********************************************************************
 * Changelog                                        
 * All notable changes to this project will be documented in this file.    
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 04/05/2022
 *
 * Purpose           : Token Collection
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality 
 * 
  **********************************************************************
 */

// IMPORTS
import mongoose from "mongoose";

var tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400 } }
});

//Exporting Contract Model
const Token = mongoose.model("token", tokenSchema);
export default Token;
