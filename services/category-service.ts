import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";

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
        return await prisma.category.delete({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.deleteFailure('Category')
    }
}


export {
    deleteCategory,
    updateCategory,
    getCategory,
    listCategories,
    addCategory
}
