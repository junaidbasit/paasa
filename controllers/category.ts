import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { categoryService } from "../services";
import _ from "lodash";

const addCategory = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body,['name','description'])
        requestHandler.checkDataExistOrNot(body, "Please provide category data")
        const data = await categoryService.addCategory(body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listCategories = async (req: Request, res: Response) => {
    try {
        const data = await categoryService.listCategories()
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getCategory = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide category id")
        const data = await categoryService.getCategory(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide category id")
        const body = _.pick(req?.body,['name','description'])
        requestHandler.checkDataExistOrNot(body, "Please provide category data")
        const data = await categoryService.updateCategory(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide category id")
        const data = await categoryService.deleteCategory(id)
        return requestHandler.sendSuccess(res, data)
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
