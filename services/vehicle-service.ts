import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";


const pickedOnlySelectedFields = (body: any) => {
    return _.pick(body, ['name', 'description', "seatingCapacity", "model", "plate", "price", "isAvailable"])
}
const addVehicle = async (body: any, categoryId: string) => {
    try {
        const createdVehicle = await prisma.vehicle.create({
            data: {
                ...body,
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            },
            include: {
                category: true
            }
        })
        return createdVehicle
    } catch (error) {
        throw successAndErrors.addFailure('Vehicle')
    }
}
const listVehicles = async () => {
    try {
        return await prisma.vehicle.findMany({
            include: {
                category: true
            },
            orderBy: {
                name: "asc"
            }
        })
    } catch (error) {
        console.log(error);
        throw successAndErrors.getFailure('Vehicle')
    }
}

const getVehicle = async (id: string) => {
    try {
        return await prisma.vehicle.findFirst({
            where: { id: id },
            include: {
                category: true
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Vehicle')
    }
}
const updateVehicle = async (id: string, body: any) => {
    try {
        return await prisma.vehicle.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Vehicle')
    }
}
const deleteVehicle = async (id: string) => {
    try {
        return await prisma.vehicle.delete({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.deleteFailure('Vehicle')
    }
}


export {
    deleteVehicle,
    updateVehicle,
    getVehicle,
    listVehicles,
    addVehicle,
    pickedOnlySelectedFields
}