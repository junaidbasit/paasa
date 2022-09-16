import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { sharedService } from "../services";


const uploadImages = async (req: Request, res: Response) => {
    try {
        const files = req?.files as Array<any>;
        requestHandler.checkDataExistOrNot(files, "Please provide files");
        const data = await sharedService.uploadImagesToCloudAndGetUrls(files)
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};


export {
    uploadImages,

}