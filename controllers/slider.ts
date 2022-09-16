import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { sliderService } from "../services";
import _ from "lodash";

const addSlider = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['name', 'sequence', "description", "picture"])
        requestHandler.checkDataExistOrNot(body, "Please provide slider data")
        const data = await sliderService.addSlider(body);
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listSlider = async (req: Request, res: Response) => {
    try {
        const data = await sliderService.listSlider()
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getSlider = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? "";
        requestHandler.checkDataExistOrNot(id, "Please provide slider id")
        const data = await sliderService.getSlider(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateSlider = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide slider ID")
        const body = _.pick(req?.body, ['name', 'sequence', "description", "picture"])
        requestHandler.checkDataExistOrNot(body, "Please provide slider data")
        const data = await sliderService.updateSlider(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteSlider = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide slider ID")
        const data = await sliderService.deleteSlider(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    addSlider,
    getSlider,
    deleteSlider,
    listSlider,
    updateSlider
}
