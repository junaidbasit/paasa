import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { paymentService } from "../services";
import _ from "lodash";

const processPayment = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['amount']);
        const user = req?.user as any;
        requestHandler.checkDataExistOrNot(body, "Please provide payment data")
        const data = await paymentService.createPaymentIntent(user, req?.body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const processDonatePayment = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['amount', "email", "description"]);
        requestHandler.checkDataExistOrNot(body, "Please provide payment data")
        const data = await paymentService.createDonatePaymentIntent(req?.body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};
export {
    processPayment,
    processDonatePayment
}
