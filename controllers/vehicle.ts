import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { vehicleService } from "../services";
import _ from "lodash";


const addVehicle = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['name', 'description', "seatingCapacity"])
        requestHandler.checkDataExistOrNot(body, "Please provide vehicle data")
        const categoryId = req?.body?.categoryId ?? ""
        requestHandler.checkDataExistOrNot(categoryId, "Please provide category id")
        const data = await vehicleService.addVehicle(body, categoryId)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listVehicles = async (req: Request, res: Response) => {
    try {
        const data = await vehicleService.listVehicles()
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getVehicle = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide vehicle id")
        const data = await vehicleService.getVehicle(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateVehicle = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide vehicle id")
        const body = _.pick(req?.body, ['name', 'description', "seatingCapacity", "price"])
        requestHandler.checkDataExistOrNot(body, "Please provide vehicle data")
        const data = await vehicleService.updateVehicle(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide vehicle id")
        const data = await vehicleService.deleteVehicle(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    deleteVehicle,
    updateVehicle,
    getVehicle,
    listVehicles,
    addVehicle
}
