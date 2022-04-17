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
        // return requestHandler.sendSuccess(res, {})
    } catch (error) {
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

        // return requestHandler.sendSuccess(res, {})
    } catch (error) {
        // return requestHandler.sendError(res, error)
    }
}

const getCategory = async () => {
    try {
        // return requestHandler.sendSuccess(res, {})
    } catch (error) {
        // return requestHandler.sendError(res, error)
    }
}
const updateCategory = async () => {
    try {
        // return requestHandler.sendSuccess(res, {})
    } catch (error) {
        // return requestHandler.sendError(res, error)
    }
}
const deleteCategory = async () => {
    try {
        // return requestHandler.sendSuccess(res, {})
    } catch (error) {
        // return requestHandler.sendError(res, error)
    }
}


export {
    deleteCategory,
    updateCategory,
    getCategory,
    listCategories,
    addCategory
}
