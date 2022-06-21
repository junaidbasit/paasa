import appConfig from "../config/app-config";
const superAdmin = appConfig.superAdminUser;
const authConfig = appConfig.authConfig;
import { prisma } from "../utils/db";
import { UserRole } from '@prisma/client';
import _, { clone } from "lodash";
import utility from "../utils/utility";
import * as bcrypt from "bcrypt";


const hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(authConfig.saltRounds);
    return bcrypt.hashSync(password, salt);
};

const createSuperAdminUser = async () => {

    try {
        const foundAdmin = await prisma.user.findFirst({
            where: { email: utility.formatEmail(superAdmin.email) }
        });
        if (foundAdmin && !_.isNull(foundAdmin)) {
            return foundAdmin
        } else {
            const userClone = clone(superAdmin);
            userClone.email = utility.formatEmail(userClone?.email);
            userClone.password = hashPassword(userClone?.password);
            const createdAdmin = await prisma.user.create({
                data: {
                    ...userClone,
                    isAcceptedTerms: true,
                    userRole: UserRole.SUPER_ADMIN
                }
            })
            return createdAdmin
        }
    } catch (error) {
        console.log(error);
    }
};

export default {
    createSuperAdminUser
}