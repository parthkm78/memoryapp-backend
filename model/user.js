/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 03/05/2022
 *
 * Purpose           : User Collection
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
  **********************************************************************
 */

// IMPORTS
import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
    userName: { type: String, required: false },
    firstName: { type: String },
    lastName: { type: String },
    overview: { type: String },
    email: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    settings: {
        notification: {
            // customized notification alert 
        },
        // additional support
        language: { type: String, default: "en" }
    },
    isDeleted: { type: Boolean, default: false },
    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date },

});

const User = mongoose.model("user", userSchema);
export default User;
