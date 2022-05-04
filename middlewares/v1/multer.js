// Import "multer" middleware for form-data parsing
import multer from "multer";
import path from "path";

/**
 * Setting a StorageEngine to store files in memory as `Buffer` objects.
 */
const inMemoryStorage = multer.memoryStorage();

export const multerMiddlewareForMemories = function (req, res, next) {
    uploadForUsers(req, res, (err) => {

        const { userName, files } = req;
        // ERROR FROM THE MULTER INSTANCE
        if (err instanceof multer.MulterError) {
            return res.status(500).send({
                status: "error",
                message: "Unexpected Error, Make sure the field name is correct or re-check attach files"
            });
        }
        // INVALID FILE TYPE, message will return from fileFilter callback
        else if (err) {
            return res.status(500).send({
                status: "error",
                message: err.message
            });
        }
        next(); // Move to next middleware with all request data
    });
};