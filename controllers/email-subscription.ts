import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { emailSubscriptionService } from "../services";
import _ from "lodash";

const addEmailSubscription = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['email'])
        requestHandler.checkDataExistOrNot(body, "Please provide Email Subscription data")
        const data = await emailSubscriptionService.addEmailSubscription(body);
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listEmailSubscription = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const data = await emailSubscriptionService.listEmailSubscription(query)
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getEmailSubscription = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? "";
        requestHandler.checkDataExistOrNot(id, "Please provide Email Subscription id")
        const data = await emailSubscriptionService.getEmailSubscription(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateEmailSubscription = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide community id")
        const body = _.pick(req?.body, ['email'])
        requestHandler.checkDataExistOrNot(body, "Please provide Email Subscription data")
        const data = await emailSubscriptionService.updateEmailSubscription(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteEmailSubscription = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide Email Subscription id")
        const data = await emailSubscriptionService.deleteEmailSubscription(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    addEmailSubscription,
    getEmailSubscription,
    deleteEmailSubscription,
    listEmailSubscription,
    updateEmailSubscription
}
