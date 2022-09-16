import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";

const addAdvertisement = async (body: any) => {
    try {
        const findoutAdd = await prisma.advertisement.findFirst({
            where: {
                page: body?.page
            }
        });
        if (_.isEmpty(findoutAdd)) {
            const createdAdd = await prisma.advertisement.create({
                data: {
                    ...body
                }
            })
            return createdAdd;
        } else {
            const updatedAdd = await prisma.advertisement.update({
                where: {
                    id: findoutAdd?.id
                },
                data: {
                    ...body
                }
            })
            return updatedAdd;
        }
    } catch (error) {
        throw successAndErrors.addFailure('Advertisement')
    }
}
const listAdvertisement = async () => {
    try {
        return await prisma.advertisement.findMany({
            where: {},
            orderBy: {
                createdAt: "desc"
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Advertisement')

    }
}

const getAdvertisementByPage = async (pageName: string) => {
    try {
        return await prisma.advertisement.findFirst({
            where: { page: pageName }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Advertisement')
    }
}

const updateAdvertisement = async (id: string, body: any) => {
    try {
        return await prisma.advertisement.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Advertisement')
    }
}
const deleteAdvertisement = async (id: string) => {
    try {
        return await prisma.advertisement.delete({
            where: { id: id }
        })
    } catch (error: any) {
        throw successAndErrors.deleteFailure(error?.customMessage ?? 'Advertisement')
    }
}

export {
    addAdvertisement,
    listAdvertisement,
    getAdvertisementByPage,
    updateAdvertisement,
    deleteAdvertisement
}
