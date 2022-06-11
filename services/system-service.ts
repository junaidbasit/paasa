
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import { PaymentStatus, ApprovedStatus, UserRole, PlanMember, DiscountType } from '@prisma/client';

const listSystemStatus = async () => {
    try {
        return {
            PaymentStatus: PaymentStatus,
            ApprovedStatus: ApprovedStatus,
            DiscountType
        }
    } catch (error) {
        throw successAndErrors.getFailure('System Status');
    }
};

const listUserRoles = async () => {
    try {
        return {
            PlanMember,
            UserRole
        }

    } catch (error) {
        throw successAndErrors.getFailure('User Roles');
    }
};




export {
    listSystemStatus,
    listUserRoles
}