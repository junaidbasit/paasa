import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
// import { Vehicle } from '@prisma/client';
import _ from "lodash";
import utility from "../utils/utility";

const addEmailSubscription = async (body: any) => {
    try {
        const createdMember = await prisma.emailSubscription.create({
            data: {
                ...body
            }
        })
        return createdMember
    } catch (error) {
        console.log(error)
        throw successAndErrors.addFailure('Email Subscription')
    }
}
const listEmailSubscription = async (query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        return await prisma.emailSubscription.findMany({
            where: {},
            skip: pagination?.skip,
            take: pagination?.take,
            orderBy: {
                createdAt: "desc"
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Email Subscription')

    }
}

const getEmailSubscription = async (id: string) => {
    try {
        return await prisma.emailSubscription.findFirst({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Email Subscription')
    }
}
const updateEmailSubscription = async (id: string, body: any) => {
    try {
        return await prisma.emailSubscription.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Email Subscription')
    }
}
const deleteEmailSubscription = async (id: string) => {
    try {
        return await prisma.emailSubscription.delete({
            where: { id: id }
        })
    } catch (error: any) {
        throw successAndErrors.deleteFailure(error?.customMessage ?? 'Email Subscription')
    }
}

export {
    addEmailSubscription,
    listEmailSubscription,
    getEmailSubscription,
    updateEmailSubscription,
    deleteEmailSubscription
}
