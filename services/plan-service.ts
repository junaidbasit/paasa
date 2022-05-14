import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import plansConfig from "../config/plans";
import { User } from '@prisma/client';

const addPlan = async (body: any) => {
    try {
        const createdPlan = await prisma.plan.create({
            data: {
                ...body
            }
        })
        return createdPlan;
    } catch (error) {
        console.log(error)
        throw successAndErrors.addFailure('Plan')
    }
}

const loadPlansIntoDatabase = async () => {
    try {
        const existedPlans = await prisma.plan.findMany({
            where: { AND: [{ isActive: true }, { isActive: false }] }
        });
        if (_.isEmpty(existedPlans) || _.isNull(existedPlans)) {
            await prisma.plan.createMany({
                data: plansConfig.plans
            });
        }
    } catch (error) {
        console.log(error);

    };
};

const listPlans = async () => {
    try {
        return await prisma.plan.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                price: "desc"
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Plan')
    }
}

const getPlan = async (id: string) => {
    try {
        return await prisma.plan.findFirst({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Plan')
    }
}
const updatePlan = async (planId: string, body: any) => {
    try {
        return await prisma.plan.update({
            where: { id: planId },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Plan')
    }
}
const deletePlan = async (id: string) => {
    try {
        return await prisma.plan.delete({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.deleteFailure('Plan')
    }
}

const activePlan = async (body: any, user: User) => {
    try {
        const { planId, startDate, endDate } = body;

        const activePlan = await prisma.userPlan.findFirst({
            where: { userId: user?.id }
        });

        if (_.isEmpty(activePlan) || _.isNull(activePlan)) {
            return await prisma.userPlan.create({
                data: {
                    user: { connect: { id: user?.id } },
                    plan: { connect: { id: planId } },
                    startDate,
                    endDate
                },
                include: { plan: true }
            });
        } else {
            return await prisma.userPlan.update({
                data: { startDate, endDate, planId },
                where: { id: activePlan?.id },
                include: { plan: true }
            })
        }
    }
    catch (error) {
        console.log(error);

        throw successAndErrors.addFailure('Plan')
    }
}

export {
    deletePlan,
    updatePlan,
    getPlan,
    listPlans,
    addPlan,
    loadPlansIntoDatabase,
    activePlan
}
