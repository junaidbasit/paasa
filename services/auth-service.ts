import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy, VerifiedCallback } from "passport-jwt";
import appConfig from "../config/app-config";
const authConfig = appConfig.authConfig;
import { Response, Request, NextFunction } from "express";
import { prisma } from "../utils/db"
import requestHandler from "../utils/request-handler";
import _ from "lodash";

/**
 * MiddleWare to authenticate
 */
const authenticated = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', {
        session: false
    },
        (err, user, info) => {
            if (!user) {
                requestHandler.sendError(res, info)
            } else {
                req.user = user;
                next();
            }
        }
    )(req, res, next)
};

/**
 * MiddleWare to authenticate with Email and password
 */
interface IVerifyOptions {
    message: string;
};
interface DoneCallBack {
    error: any, user?: any, options?: IVerifyOptions
}


const authenticateWithToken = async (jwtPayload: any, done: VerifiedCallback) => {
    const { userId } = jwtPayload;

    const user = await prisma.user.findFirst({
        where: {
            id: { equals: userId }
        },
        include: {
            profile: true,
            userPlan: true
        }
    });
    if (!_.isEmpty(user)) {
        return done(null, user);
    } else {
        return done(null, false, { message: "Invalid Token" });
    };
};


/** **********************************
 *
 * local strategy use by passportjs
 * Access by token
 *
 * ************************************ */
passport.use(
    new JWTStrategy(
        {
            secretOrKey: authConfig.jwt_secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        authenticateWithToken
    )
);

export {
    authenticated,
};
