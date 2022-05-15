import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { vehicleBookingService } from "../services";
import _ from "lodash";
// import { User } from '@prisma/client';


const calculateRent = async (req: Request, res: Response) => {
    try {
        const body = vehicleBookingService.pickedOnlyCalculateRentSelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide vehicle data");
        const user = req?.user;
        const data = await vehicleBookingService.calculateRent(body, user)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const addbooking = async (req: Request, res: Response) => {
    try {
        const body = vehicleBookingService.pickedOnlyAddBookingSelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide vehicle data");
        const user = req?.user;
        const data = await vehicleBookingService.addBooking(body, user)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const user = req?.user;
        const data = await vehicleBookingService.getAllBookings(user)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

export {
    calculateRent,
    addbooking
}
