import multer, { FileFilterCallback } from 'multer'
import { Response, Request } from "express";

const imageFileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

export const uploadImage = multer({
    storage: multer.memoryStorage(),
    fileFilter: imageFileFilter
})
