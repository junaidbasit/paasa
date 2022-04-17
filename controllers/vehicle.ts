import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";

const addVehicle = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listVehicles = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getVehicle = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateVehicle = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
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
