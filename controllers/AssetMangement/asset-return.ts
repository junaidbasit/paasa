
import { Response, Request } from "express";
import requestHandler from "../../utils/request-handler";
import { returnAssetService } from "../../services/AssetMangement";
import _ from "lodash";
import { UserRole, ApprovedStatus } from '@prisma/client';

// const createReturn = async (req: Request, res: Response) => {
//     try {
//         const body = returnAssetService.pickedOnlyCreateReturnFields(req?.body);
//         requestHandler.checkDataExistOrNot(body, "Please provide data");
//         const result = await returnAssetService.createReturn(body);
//         // if (result?.IssueVechicle?.booking?.user?.userRole != UserRole.SUPER_ADMIN) {
//         //     emailService.sendEmailOnVechileReturn(result?.IssueVechicle?.booking?.user,
//         //         result?.IssueVechicle?.booking?.user?.profile, result?.IssueVechicle?.booking?.vehicle, result as any)
//         // }
//         return requestHandler.sendSuccess(res, result);
//     } catch (error) {
//         return requestHandler.sendError(res, error)
//     }
// };

// const getReturn = async (req: Request, res: Response) => {
//     try {
//         const id = req?.params?.id;
//         const data = await returnAssetService.getReturn(id);
//         return requestHandler.sendSuccess(res, data);
//     } catch (error) {
//         return requestHandler.sendError(res, error)
//     }
// };

// const getAllVehicleReturns = async (req: Request, res: Response) => {
//     try {
//         const query = req?.query;
//         const data = await returnAssetService.getAllVehicleReturns(query);
//         return requestHandler.sendSuccess(res, data);
//     } catch (error) {
//         return requestHandler.sendError(res, error)
//     }
// };
const calulateFinalChanrges = async (req: Request, res: Response) => {
    try {
        const body = returnAssetService.pickedOnlyCalculateFinalChargesFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide data");
        const result = await returnAssetService.calulateFinalCharges(body);
        return requestHandler.sendSuccess(res, result);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    calulateFinalChanrges
}