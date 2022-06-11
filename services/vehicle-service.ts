import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import utility from "../utils/utility";
import { PaymentStatus, ApprovedStatus } from '@prisma/client';


const pickedOnlySelectedFields = (body: any) => {
    return _.pick(body, ['name', 'image', 'description', "seatingCapacity", "model", "plate", "dailyRent", "isAvailable", "securityDeposit"])
};
const pickedOnlySelectedFieldsForVehicleDiscount = (body: any) => {
    return _.pick(body, ['discount', 'userRole'])
};

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
        const todayStartDay = utility.getStartDayOfCurrentDay();
        const vehicles = await prisma.vehicle.findMany({
            where: {
                isAvailable: true,
            },
            include: {
                category: true,
                vehicleBooking: {
                    where: {
                        AND: [{
                            OR: [{ startDate: { gte: todayStartDay } },
                            { endDate: { gte: todayStartDay } }
                            ]
                        },
                        {
                            OR: [{ approvedStatus: { equals: ApprovedStatus.APPROVED } },
                            { approvedStatus: { equals: ApprovedStatus.PENDING } }
                            ]
                        }]
                    }
                    // where: {
                    //     OR: [{ startDate: { gte: todayStartDay } },
                    //     { endDate: { gte: todayStartDay } }
                    //     ]
                    // }
                }
            },
            orderBy: {
                name: "asc"
            }
        });
        const vehiclesWithBooking = [];
        for (const single of vehicles) {
            const vehicleBooking = single?.vehicleBooking;
            const datesAlreadybooked = vehicleBooking?.map(x =>
                utility.getDatesBetweenTwoDates(utility.getOnlyDate(x?.startDate), utility.getOnlyDate(x?.endDate)))
            const datesAlreadybookedFlatten = _.flatten(datesAlreadybooked);
            const vehicleWithBooking = {
                ...single,
                datesAlreadybooked: datesAlreadybookedFlatten
            };
            vehiclesWithBooking.push(vehicleWithBooking);
        }
        return vehiclesWithBooking
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

const addVehicleDiscount = async (body: any) => {
    try {
        const createdVehicleDiscount = await prisma.vehicleDiscount.create({
            data: { ...body }
        })
        return createdVehicleDiscount
    } catch (error) {
        throw successAndErrors.addFailure('Vehicle Discount')
    }
}
const listVehiclesDiscount = async () => {
    try {
        return await prisma.vehicleDiscount.findMany({})
    } catch (error) {
        throw successAndErrors.getFailure('Vehicle Discount')
    }
}
const getVehicleDiscount = async (id: string) => {
    try {
        return await prisma.vehicleDiscount.findFirst({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Vehicle Discount')
    }
}
const updateVehicleDiscount = async (id: string, body: any) => {
    try {
        return await prisma.vehicleDiscount.update({
            where: { id: id },
            data: { ...body }
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Vehicle Discount')
    }
}


export {
    deleteVehicle,
    updateVehicle,
    getVehicle,
    listVehicles,
    addVehicle,
    pickedOnlySelectedFields,
    addVehicleDiscount,
    listVehiclesDiscount,
    getVehicleDiscount,
    updateVehicleDiscount,
    pickedOnlySelectedFieldsForVehicleDiscount
}