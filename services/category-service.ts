import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
// import { Vehicle } from '@prisma/client';
import _ from "lodash";

const addCategory = async (body: any) => {
    try {
        const createdCategoty = await prisma.category.create({
            data: {
                ...body
            }
        })
        return createdCategoty
    } catch (error) {
        console.log(error)
        throw successAndErrors.addFailure('Category')
    }
}
const listCategories = async () => {
    try {
        return await prisma.category.findMany({
            include: {
                vehicles: true
            },
            orderBy: {
                name: "asc"
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Category')

    }
}

const getCategory = async (id: string) => {
    try {
        return await prisma.category.findFirst({
            where: { id: id },
            include: {
                vehicles: true
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Category')
    }
}
const updateCategory = async (id: string, body: any) => {
    try {
        return await prisma.category.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Category')
    }
}
const deleteCategory = async (id: string) => {
    try {
        const findVechiles = await prisma.category.findFirst({
            where: {
                id: id
            },
            include: {
                vehicles: true
            }
        });
        if (!_.isEmpty(findVechiles) && _.isEmpty(findVechiles?.vehicles)) {
            return await prisma.category.delete({
                where: { id: id }
            })
        } else {
            successAndErrors.throwCustomMessage("This category contain vehicles, Please delete vehicles before to delete Category, Category")
        }

    } catch (error: any) {
        throw successAndErrors.deleteFailure(error?.customMessage ?? 'Category')
    }
}

const listVehicleByCategory = async (id: string) => {
    try {
        return await prisma.vehicle.findMany({
            where: { categoryId: id }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Catefories')
    }
}


export {
    deleteCategory,
    updateCategory,
    getCategory,
    listCategories,
    addCategory,
    listVehicleByCategory
}
