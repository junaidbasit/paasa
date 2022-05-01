import bcrypt from "bcryptjs";
import _ from "lodash";
import { UserRole } from "../types/enums";
import { prisma } from "../utils/db";
import utility from "../utils/utility";
import successAndErrors from "../utils/successAndErrors";

const createSuperAdminUser = async () => {
    const adminUser = {
        username: "superadmin",
        isAcceptedTerms: true,
        password: bcrypt.hashSync("password@123", 10),
        userRole: UserRole.SUPER_ADMIN,
        email: "adminuser@gmail.com"
    }
    return await createUser(adminUser);
}

const hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const createUser = async (user: any) => {
    if (!utility.validateEmail(user?.email)) {
        return successAndErrors.returnErrorInCaseOfValueNotFound("email");
    };

    user.email = utility.formatEmail(user?.email);
    const emailValidation = await checkUserEmailAlreadyExistOrNot(user?.email);
    if (emailValidation) {
        throw successAndErrors.addFailure("Email already exist, Please try with different email. User");
    }
    if (user?.password) {
        user.password = hashPassword(user.password);
    }
    return await prisma.user.create({ data: user });
};

const validateEmail = (email: string) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const validatePassword = (password: string) => {
    var re = /^(?=^.{3,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/;
    return re.test(password);
};

let userAccountValidation = async (user: any) => {
    let checkMail = await validateEmail(userData.email);
    let checkPassword = await validatePassword(userData.password);
    if (!userData) {
        return { result: false, message: "Please fill all the files" };
    } else if (
        userData &&
        (!userData.firstName || userData.firstName.length == 0)
    ) {
        return { result: false, message: "Please enter first name" };
    } else if (
        userData &&
        (!userData.lastName || userData.lastName.length == 0)
    ) {
        return { result: false, message: "Please enter last name" };
    } else if (userData && (!userData.email || userData.email.length == 0)) {
        return { result: false, message: "Please enter email" };
    } else if (
        userData &&
        userData.email &&
        userData.email.length > 0 &&
        !checkMail
    ) {
        return { result: false, message: "Please enter valid email" };
    } else if (
        userData &&
        (!userData.userName || userData.userName.length == 0)
    ) {
        return { result: false, message: "Please enter username" };
    } else if (
        userData &&
        (!userData.password || userData.password.length == 0)
    ) {
        return { result: false, message: "Please enter password" };
    } else if (userData && userData.password && userData.password.length < 8) {
        return { result: false, message: "Paswword must at least 8 charecters" };
    } else if (
        userData &&
        userData.password &&
        userData.password.length > 0 &&
        !checkPassword
    ) {
        return {
            result: false,
            message:
                "The password must contain one upper case letter, one lowercase letter and one numeric digit",
        };
    } else {
        return { result: true, message: "Profile created successfully" };
    }
};

const checkUserEmailAlreadyExistOrNot = async (email: string) => {
    try {
        let findUserWithEmail = await prisma.user.findFirst({
            where: {
                email: { equals: email }
            },
        });

        if (!_.isEmpty(findUserWithEmail)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return true;
    }
};
// let checkUserNameAlreadyExistOrNot = async (userName) => {
//     try {
//         let findUserWithUserName = await User.find({ username: userName });
//         if (findUserWithUserName && findUserWithUserName.length > 0) {
//             return await sharedService.setErrorInResponse(
//                 "The username you have entered is already associated with another account"
//             );
//         } else {
//             return false;
//         }
//     } catch (error) {
//         return await sharedService.setErrorInResponse(
//             "The username you have entered is already associated with another account"
//         );
//     }
// };

export {
    createSuperAdminUser

}