import { prisma } from "../utils/db";
import utility from "../utils/utility";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import moment from "moment";
import firebase from "../config/firebase-config";
import { v4 as uuidv4 } from 'uuid';

const uploadFileAndGetURL = (file: Express.Multer.File): Promise<any> => {
    const newFileName = new Date().getTime().toString() + file?.originalname;

    const blob = firebase.file(newFileName);
    return new Promise((resolve, reject) => {
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file?.mimetype,
                firebaseStorageDownloadTokens: uuidv4()
            },
            public: true,
            validation: "md5"
        });
        blobWriter.on('error', (err) => {
            resolve({
                isUpload: false, message: 'error from image upload '.concat(err?.message ?? err?.name),
                originalFileName: file?.originalname
            });
            // reject('error from image upload '.concat(err?.message ?? err?.name))
        });
        blobWriter.on('finish', async () => {
            // console.log("text", blob?.publicUrl());
            // console.log("metadata", blob?.metadata);


            // The file upload is complete.
            // const signedUrls = await blob.getSignedUrl({
            //     action: 'read',
            //     expires: moment().add(3, 'years').toDate()
            // });url: signedUrls[0],
            resolve({
                isUpload: true, url: blob?.publicUrl(),
                originalFileName: file?.originalname
            })
        });
        blobWriter.end(file?.buffer)
    })
};


const uploadImagesToCloudAndGetUrls = async (files: Array<Express.Multer.File>) => {
    let imagesUploadPromise: any[] = [];
    for (const file of files) {
        imagesUploadPromise.push(uploadFileAndGetURL(file));
        // imagesURLs.push({
        //     thumbnail: await this.fileService.createThumbnailAndUpload(file),
        //     orignalImage: await this.fileService.uploadFileAndGetURL(file)
        // });
    };
    const uploadImages: Array<any> = await Promise.all(imagesUploadPromise);
    const successImages: any[] = [];
    const failedImages: any[] = [];
    for (const image of uploadImages) {
        if (image?.isUpload) {
            successImages.push(image);
        } else {
            failedImages.push(image);

        }
    };
    return { successImages, failedImages };
};

export {
    uploadImagesToCloudAndGetUrls
}