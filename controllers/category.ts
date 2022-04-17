import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { categoryService } from "../services";

const addCategory = async (req: Request, res: Response) => {
    try {
        const data = await categoryService.addCategory(req.body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listCategories = async (req: Request, res: Response) => {
    try {
        const data = await categoryService.listCategories()
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
