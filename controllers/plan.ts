import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { planService } from "../services";
import _ from "lodash";
import { User } from '@prisma/client';

const addPlan = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['name', 'description', "price", "member"]);
        requestHandler.checkDataExistOrNot(body, "Please provide Plan data")
        const data = await planService.addPlan(body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const loadPlansIntoDb = async (req: Request, res: Response) => {
    try {
        const data = await planService.loadPlansIntoDatabase()
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const userPlanActivation = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['planId', 'startDate', 'endDate']);
        const user = req?.user as User;
        requestHandler.checkDataExistOrNot(body, "Please provide Plan data")
        const data = await planService.activePlan(body, user)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const listPlans = async (req: Request, res: Response) => {
    try {
        const data = await planService.listPlans()
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getPlan = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide Plan Id")
        const data = await planService.getPlan(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updatePlan = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide Plan id")
        const body = _.pick(req?.body, ['name', 'description', "price", "member"]);
        requestHandler.checkDataExistOrNot(body, "Please provide Plan data")
        const data = await planService.updatePlan(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deletePlan = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide Plan Id")
        const data = await planService.deletePlan(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    deletePlan,
    updatePlan,
    getPlan,
    listPlans,
    addPlan,
    loadPlansIntoDb,
    userPlanActivation
}
