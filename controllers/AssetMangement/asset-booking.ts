import { Response, Request } from "express";
import requestHandler from "../../utils/request-handler";
import { assetBookingService } from "../../services/AssetMangement";
import _ from "lodash";
import emailService from "../../services/email-service";
import { UserRole, ApprovedStatus } from '@prisma/client';


const addAssetToBundle = async (req: Request, res: Response) => {
    try {
        const body = assetBookingService.pickedOnlyCalculateRentSelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide asset data");
        const user = req?.user;
        const data = await assetBookingService.addAssetToBundle(body, user);
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const addbooking = async (req: Request, res: Response) => {
    try {
        const body = assetBookingService.pickedOnlyAddBookingSelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide asset data");
        const user: any = req?.user;
        const data = await assetBookingService.confirmBooking(body, user);
        // user?.userRole != UserRole.SUPER_ADMIN ? emailService.sendEmailOnBooking(user, user?.profile, data, data?.asset) : null;
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const data = await assetBookingService.getAllBookings(query)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const geCurrentUserBookings = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const user = req?.user;
        const data = await assetBookingService.getCurrentUserBookings(user, query)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


const getBooking = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const data = await assetBookingService.getBookingById(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const body = assetBookingService.pickOnlyUpdateBookingSelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide update booking data");
        const data = await assetBookingService.updateBooking(id, body);
        // if (data?.user?.userRole != UserRole.SUPER_ADMIN && !_.isEmpty(body?.approvedStatus) &&
        // (body?.approvedStatus == ApprovedStatus.APPROVED || body?.approvedStatus == ApprovedStatus.REJECTED)) {
        // emailService.sendEmailOnBookingApprovalOrRejection(data?.user, data?.user?.profile, data, data?.asset)
        // }
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};


export {
    addAssetToBundle,
    addbooking,
    getAllBookings,
    getBooking,
    updateBooking,
    geCurrentUserBookings
}
