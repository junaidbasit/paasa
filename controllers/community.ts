import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { communityService } from "../services";
import _ from "lodash";

const addCommunityMember = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['name', 'description', "designation", "picture"])
        requestHandler.checkDataExistOrNot(body, "Please provide Community data")
        const data = await communityService.addCommunityMember(body);
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listCommunityMember = async (req: Request, res: Response) => {
    try {
        const data = await communityService.listCommunityMember()
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getCommunityMember = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? "";
        requestHandler.checkDataExistOrNot(id, "Please provide Community id")
        const data = await communityService.getCommunityMember(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateCommunityMember = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide community id")
        const body = _.pick(req?.body, ['name', 'description', "designation", "picture"])
        requestHandler.checkDataExistOrNot(body, "Please provide Community data")
        const data = await communityService.updateCommunityMember(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteCommunityMember = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide Community id")
        const data = await communityService.deleteCommunityMember(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    addCommunityMember,
    getCommunityMember,
    deleteCommunityMember,
    listCommunityMember,
    updateCommunityMember
}
