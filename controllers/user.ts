import { Response, Request } from "express";
import requestHandler from "../utils/request-handler";
import { userService } from "../services";
import _ from "lodash";
import { User } from '@prisma/client';
import emailService from "../services/email-service";

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = req?.user;
        if (user) {
            return requestHandler.sendSuccess(res, user);
        } else {
            return requestHandler.sendError(res, "User not found");
        }
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const query = req?.query;
        const users = await userService.getAllUsers(query);
        return requestHandler.sendSuccess(res, users);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
}

const signupUser = async (req: Request, res: Response) => {
    try {
        const body = req?.body
        requestHandler.checkDataExistOrNot(body, "Please provide user data")
        const user = await userService.createUser(body);
        // console.log("user", user);
        emailService.sendEmailOnRegistration(user, user?.profile);
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
    try {
        const body = req?.body;
        const user = req?.user as User;
        requestHandler.checkDataExistOrNot(body, "Please provide user data")
        const data = await userService.changePassword(user, body);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const emailVerification = async (req: Request, res: Response) => {
    try {
        const body = req?.body;
        requestHandler.checkDataExistOrNot(body?.email, "Please provide email");
        requestHandler.checkDataExistOrNot(body?.code, "Please provide code");
        const data = await userService.emailVerification(body?.email, body?.code);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const sendEmailVerification = async (req: Request, res: Response) => {
    try {
        const body = req?.body;
        requestHandler.checkDataExistOrNot(body?.email, "Please provide user email")
        const data = await userService.sendEmailVerification(body?.email);
        emailService.sendEmailForVerification(data?.email, data?.code);
        return requestHandler.sendSuccess(res, {});
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};

const sendContactUsEmail = async (req: Request, res: Response) => {
    try {
        const body = req?.body;
        requestHandler.checkDataExistOrNot(body?.email, "Please provide email")
        requestHandler.checkDataExistOrNot(body?.message, "Please provide message")
        emailService.sendEmailOnContactUs(body?.email, body?.name, body?.message);
        return requestHandler.sendSuccess(res, {});
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
};


const updateProfile = async (req: Request, res: Response) => {
    try {
        const body = req?.body;
        const pickBody = userService.pickUpUpdateProfileFields(body)
        const user = req?.user as any;
        requestHandler.checkDataExistOrNot(pickBody, "Please provide profile data")
        const data = await userService.updateProfile(user, pickBody);
        return requestHandler.sendSuccess(res, data);
    } catch (error) {
        return requestHandler.sendError(res, error)
    }
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
    forgotPassword,
    getAllUsers,
    updateProfile,
    emailVerification,
    sendContactUsEmail,
    sendEmailVerification
}