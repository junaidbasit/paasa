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

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const data = await vehicleBookingService.getAllBookings(query)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getBooking = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const data = await vehicleBookingService.getBooking(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const body = vehicleBookingService.pickOnlyUpdateBookingSelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide update booking data");
        const data = await vehicleBookingService.updateBooking(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const deleteBooking = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const data = await vehicleBookingService.deleteBooking(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

export {
    calculateRent,
    addbooking,
    getAllBookings,
    getBooking,
    updateBooking,
    deleteBooking
}
