import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
// import { Vehicle } from '@prisma/client';
import _ from "lodash";

const addCommunityMember = async (body: any) => {
    try {
        const createdMember = await prisma.communityMember.create({
            data: {
                ...body
            }
        })
        return createdMember
    } catch (error) {
        console.log(error)
        throw successAndErrors.addFailure('Community')
    }
}
const listCommunityMember = async () => {
    try {
        return await prisma.communityMember.findMany({
            where: {},
            orderBy: {
                createdAt: "desc"
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Community')

    }
}

const getCommunityMember = async (id: string) => {
    try {
        return await prisma.communityMember.findFirst({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Community')
    }
}
const updateCommunityMember = async (id: string, body: any) => {
    try {
        return await prisma.communityMember.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Community')
    }
}
const deleteCommunityMember = async (id: string) => {
    try {
        return await prisma.communityMember.delete({
            where: { id: id }
        })
    } catch (error: any) {
        throw successAndErrors.deleteFailure(error?.customMessage ?? 'Community')
    }
}

export {
    addCommunityMember,
    listCommunityMember,
    getCommunityMember,
    updateCommunityMember,
    deleteCommunityMember
}
