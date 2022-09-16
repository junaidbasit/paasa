import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { vehicleIssueReturn } from "../services";
import _ from "lodash";
import emailService from "../services/email-service";
import { UserRole, ApprovedStatus } from '@prisma/client';

const uploadImages = async (req: Request, res: Response) => {
    try {
        const files = req?.files as Array<any>;
        requestHandler.checkDataExistOrNot(files, "Please provide files");
        const data = await vehicleIssueReturn.uploadImagesToCloudAndGetUrls(files)
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const createIssue = async (req: Request, res: Response) => {
    try {
        const body = vehicleIssueReturn.pickedOnlyCreateIssueFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide data");
        const result = await vehicleIssueReturn.createIssue(body);
        if (result?.booking?.user?.userRole != UserRole.SUPER_ADMIN) {
            emailService.sendEmailOnVechileIssue(result?.booking?.user, result?.booking?.user?.profile, result?.booking as any, result?.booking?.vehicle)
        }
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getIssue = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const data = await vehicleIssueReturn.getIssue(id);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getAllVehicleIssues = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const data = await vehicleIssueReturn.getAllVehicleIssues(query);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const createReturn = async (req: Request, res: Response) => {
    try {
        const body = vehicleIssueReturn.pickedOnlyCreateReturnFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide data");
        const result = await vehicleIssueReturn.createReturn(body);
        if (result?.IssueVechicle?.booking?.user?.userRole != UserRole.SUPER_ADMIN) {
            emailService.sendEmailOnVechileReturn(result?.IssueVechicle?.booking?.user,
                result?.IssueVechicle?.booking?.user?.profile, result?.IssueVechicle?.booking?.vehicle, result as any)
        }
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getReturn = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const data = await vehicleIssueReturn.getReturn(id);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getAllVehicleReturns = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const data = await vehicleIssueReturn.getAllVehicleReturns(query);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const createIssueReturnCharges = async (req: Request, res: Response) => {
    try {
        const body = vehicleIssueReturn.pickedOnlyCreateIssueReturnChargesFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide data");
        const result = await vehicleIssueReturn.createIssueReturnCharges(body);
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getIssueReturnCharges = async (req: Request, res: Response) => {
    try {
        const data = await vehicleIssueReturn.getIssueReturnCharges();
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const updateIssueReturnCharges = async (req: Request, res: Response) => {
    try {
        const body = vehicleIssueReturn.pickedOnlyCreateIssueReturnChargesFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide data");
        const result = await vehicleIssueReturn.updateIssueReturnCharges(body);
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const calculateReturnCharges = async (req: Request, res: Response) => {
    try {
        const body = vehicleIssueReturn.pickedOnlyCalculateReturnChargesFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide data");
        const result = await vehicleIssueReturn.calculateReturnCharges(body);
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const calulateFinalChanrges = async (req: Request, res: Response) => {
    try {
        const body = vehicleIssueReturn.pickedOnlyCalculateFinalChargesFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide data");
        const result = await vehicleIssueReturn.calulateFinalCharges(body);
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}



export {
    uploadImages,
    createIssue,
    getIssue,
    getAllVehicleIssues,
    createReturn,
    getReturn,
    getAllVehicleReturns,
    createIssueReturnCharges,
    getIssueReturnCharges,
    updateIssueReturnCharges,
    calculateReturnCharges,
    calulateFinalChanrges
}
