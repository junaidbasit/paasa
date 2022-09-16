import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { donationService } from "../services";
import _ from "lodash";

const addDonation = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['name', 'description', "email", "phoneNumber", "amount"])
        requestHandler.checkDataExistOrNot(body, "Please provide category data")
        const data = await donationService.addDonation(body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listDonations = async (req: Request, res: Response) => {
    try {
        const query = req?.query as any;
        const data = await donationService.listDonations(query)
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
export {
    addDonation,
    listDonations
}
