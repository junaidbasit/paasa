import { Response, Request, NextFunction } from "express";
import { UserRole } from "../types/enums";
import { User } from '@prisma/client';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { userRole } = req?.user as User;
    // no need to verify token again
    // the `req.user.isAdmin` is already available from isAuth
    // also no need to query a database, we have all the info we need from the token
    if (UserRole.SUPER_ADMIN == userRole) {
        next();
    } else {
        return res.status(401).send({
            type: 'error',
            message: "You are not authorized to perform this action"
        })
    }
};
export {
    isAdmin
}