import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { systemService } from "../services";

const listStatus = async (req: Request, res: Response) => {
    try {
        const data = await systemService.listSystemStatus();
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error);
    }
};

const listUserRoles = async (req: Request, res: Response) => {
    try {
        const data = await systemService.listUserRoles();
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error);
    }
};

export {
    listStatus,
    listUserRoles
}