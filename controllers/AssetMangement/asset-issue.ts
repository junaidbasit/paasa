import { Response, Request } from "express";
import requestHandler from "../../utils/request-handler";
import { issueAssetService } from "../../services/AssetMangement";
import _ from "lodash";


const createIssue = async (req: Request, res: Response) => {
    try {
        const body = issueAssetService.pickedOnlyCreateIssueFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide issue data");
        const result = await issueAssetService.createIssue(body);
        // if (result?.booking?.user?.userRole != UserRole.SUPER_ADMIN) {
        //     emailService.sendEmailOnVechileIssue(result?.booking?.user, result?.booking?.user?.profile, result?.booking as any, result?.booking?.vehicle)
        // }
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getIssue = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const data = await issueAssetService.getIssue(id);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getAllAssetssues = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const data = await issueAssetService.getAllVehicleIssues(query);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

export {
    createIssue,
    getIssue,
    getAllAssetssues
}