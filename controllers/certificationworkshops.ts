import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { certificationWorkshopService } from "../services";
import _ from "lodash";

const addCertificationworkshop = async (req: Request, res: Response) => {
    try {
        const body = _.pick(req?.body, ['title', 'description', "picture", "date", "type"]);
        requestHandler.checkDataExistOrNot(body, "Please provide Certification workshop data")
        const data = await certificationWorkshopService.addCertificationWorkshop(body);
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const listCertificationworkshop = async (req: Request, res: Response) => {
    try {
        console.log("listCertificationworkshop");
        const query = req?.query as any;
        const type = req?.params?.type;
        const data = await certificationWorkshopService.listCertificationWorkshop(type)
        return requestHandler.sendSuccess(res, data, 200, "Success result")
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const getCertificationworkshop = async (req: Request, res: Response) => {
    try {
        console.log("getCertificationworkshop");
        const id = req?.params?.id ?? "";
        requestHandler.checkDataExistOrNot(id, "Please provide Certification workshop id")
        const data = await certificationWorkshopService.getCertificationWorkshop(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateCertificationworkshop = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide community id")
        const body = _.pick(req?.body, ['title', 'description', "picture", "date", "type"]);
        requestHandler.checkDataExistOrNot(body, "Please provide Certification workshop data")
        const data = await certificationWorkshopService.updateCertificationWorkshop(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteCertificationworkshop = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide Certification workshop id")
        const data = await certificationWorkshopService.deleteCertificationWorkshop(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}


export {
    addCertificationworkshop,
    getCertificationworkshop,
    deleteCertificationworkshop,
    listCertificationworkshop,
    updateCertificationworkshop
}
