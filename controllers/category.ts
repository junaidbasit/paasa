import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";

const addCategory = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listCategories = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getCategory = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateCategory = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteCategory = async (req: Request, res: Response) => {
    try {
        return requestHandler.sendSuccess(res, {})
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    deleteCategory,
    updateCategory,
    getCategory,
    listCategories,
    addCategory
}
