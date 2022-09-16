import { Response, Request } from "express";
import requestHandler from "../../utils/request-handler";
import { assetService } from "../../services/AssetMangement";
import _ from "lodash";


const addAsset = async (req: Request, res: Response) => {
    try {
        const body = assetService.pickedOnlySelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide asset data")
        const data = await assetService.addAsset(body);
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const listAssets = async (req: Request, res: Response) => {
    try {
        const data = await assetService.listAssets()
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const listAssetsByAdmin = async (req: Request, res: Response) => {
    try {
        const data = await assetService.listAssetsByAdmin();
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getAsset = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide asset ID")
        const data = await assetService.getAsset(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const updateAsset = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide asset ID")
        const body = assetService.pickedOnlySelectedFields(req?.body);
        requestHandler.checkDataExistOrNot(body, "Please provide asset data")
        const data = await assetService.updateAsset(id, body)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}
const deleteAsset = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id ?? ""
        requestHandler.checkDataExistOrNot(id, "Please provide vehicle ID");
        const data = await assetService.deleteAsset(id)
        return requestHandler.sendSuccess(res, data)
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

export {
    deleteAsset,
    updateAsset,
    getAsset,
    listAssets,
    listAssetsByAdmin,
    addAsset
}

