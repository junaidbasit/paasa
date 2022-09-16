import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { advertisementService } from "../services";
import _ from "lodash";

const addAdvertisement = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['name', 'description', "page", "picture"])
        requestHandler.checkDataExistOrNot(body, "Please provide advertisement data")
        const page = body?.page ?? "";
        requestHandler.checkDataExistOrNot(page, "Please provide page")
        const data = await advertisementService.addAdvertisement(body);
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listAdvertisement = async (req: Request, res: Response) => {
    try {
        const data = await advertisementService.listAdvertisement()
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getAdvertisementByPage = async (req: Request, res: Response) => {
    try {
        const page = req?.params?.page ?? "";
        requestHandler.checkDataExistOrNot(page, "Please provide page name")
        const data = await advertisementService.getAdvertisementByPage(page)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateAdvertisement = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide community id")
        const body = _.pick(req?.body, ['name', 'description', "page", "picture"])
        requestHandler.checkDataExistOrNot(body, "Please provide advertisement data")
        const data = await advertisementService.updateAdvertisement(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteAdvertisement = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide advertisement id")
        const data = await advertisementService.deleteAdvertisement(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    addAdvertisement,
    getAdvertisementByPage,
    deleteAdvertisement,
    listAdvertisement,
    updateAdvertisement
}
