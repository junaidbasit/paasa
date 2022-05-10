import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { userService } from "../services";
import _ from "lodash";

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = req?.user
        if (user) {
            return requestHandler.sendSuccess(res, user);
        } else {
            return requestHandler.sendError(res, "User not found");
        }
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const signupUser = async (req: Request, res: Response) => {
    try {
        const body = req?.body
        requestHandler.checkDataExistOrNot(body, "Please provide user data")
        const user = await userService.createUser(body);
        const token = userService.generateToken(user);
        return requestHandler.sendSuccess(res, { token });
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};
const loginUser = async (req: Request, res: Response) => {
    try {
        const body = req?.body;
        const user = await userService.validateUserWithEmailAndPassword(body?.email, body?.password);
        if (user) {
            const token = userService.generateToken(user);
            return requestHandler.sendSuccess(res, { token });
        } else {
            return requestHandler.sendError(res, { message: "Invalid email or password", status: 401 })
        }
    } catch (error) {
        return requestHandler.sendError(res, { message: "Invalid email or password", status: 401 })
    }
};

const changePassword = async (req: Request, res: Response) => {

};

const updateUser = async (req: Request, res: Response) => {

};

const forgotPassword = async (req: Request, res: Response) => {

};


export {
    getCurrentUser,
    signupUser,
    loginUser,
    changePassword,
    updateUser,
    forgotPassword
}