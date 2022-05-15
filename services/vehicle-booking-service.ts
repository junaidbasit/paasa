import { prisma } from "../utils/db";
import utility from "../utils/utility";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import moment from "moment";


const pickedOnlyCalculateRentSelectedFields = (body: any) => {
    return _.pick(body, ['startDate', 'endDate', 'vehicleId'])
};

const pickedOnlyAddBookingSelectedFields = (body: any) => {
    return _.pick(body, ['amountCharged', 'firstName', 'lastName', 'phoneNumber', 'emergencyPhoneNumber', 'email', 'address', 'nameOfDriver', 'driverLicenseNumber', 'bookingReason', 'isAcceptedTerms', 'startDate', 'endDate', 'vehicleId'])
};

const format = (num: number) => num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const calculateRent = async (body: any, user: any) => {
    try {
        const { startDate, endDate, vehicleId } = body;
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId }
        })
        if (!_.isEmpty(vehicle) && !_.isNull(vehicle) && vehicle?.isAvailable === true) {
            let discountPercentage = 0;
            if (!_.isEmpty(user?.userPlan) && !_.isNull(user?.userPlan)) {
                const vehicleDiscount = await prisma.vehicleDiscount.findFirst({
                    where: { memberShip: user?.userPlan?.member }
                });
                if (!_.isEmpty(vehicleDiscount) && !_.isNull(vehicleDiscount)) {
                    discountPercentage = vehicleDiscount.discount;
                }
            };

            const bookingEndDate = moment(endDate, "DD-MM-YYYY");
            const bookingStartDate = moment(startDate, "DD-MM-YYYY");
            const bookingDays = bookingEndDate.diff(bookingStartDate, 'days') + 1 // 1
            const bookingPrice = vehicle.dailyRent * bookingDays;
            const discount = bookingPrice * (discountPercentage / 100);
            const totalPrice = bookingPrice - discount;

            return {
                bookingDays,
                bookingPrice: parseFloat(format(bookingPrice)),
                discount: parseFloat(format(discount)),
                totalPrice: parseFloat(format(totalPrice)),
                securityDeposit: vehicle.securityDeposit,
            }

        } else {
            throw successAndErrors.getFailure('Vehicle is not available, Please book another vehicle, Calculate Rent');
        }
    } catch (error) {
        throw successAndErrors.getFailure('Vehicle is not available, Please book another vehicle, Calculate Rent');
    }
}

const addBooking = async (body: any, user: any) => {
    try {

        const { startDate, endDate, vehicleId } = body;
        const setStartDate = utility.setStartDayTimeToDate(startDate);
        const setEndDate = utility.setEndDayTimeToDate(endDate);
        const todayStartDay = utility.getStartDayOfCurrentDay();

        const alreadyBooking = await prisma.vehicleBooking.findMany({
            where: {
                OR: [{ startDate: { gte: todayStartDay } },
                { endDate: { gte: todayStartDay } }
                ]
            }
        });

        const datesWantToBook = utility.getDatesBetweenTwoDates(setStartDate, setEndDate);
        const datesAlreadybooked = alreadyBooking?.map(x =>
            utility.getDatesBetweenTwoDates(utility.getOnlyDate(x?.startDate), utility.getOnlyDate(x?.endDate)))
        const datesAlreadybookedFlatten = _.flatten(datesAlreadybooked);
        const foundDates = _.intersection(datesWantToBook, datesAlreadybookedFlatten);

        if (_.isEmpty(alreadyBooking) || _.isEmpty(foundDates)) {
            const { totalPrice } = await calculateRent(body, user);
            if (totalPrice != body?.amountCharged) {
                throw successAndErrors.addFailure('Amount charged is not correct, Booking');
            } else {
                const updateData: any = _.omit(body, ['vehicleId', 'startDate', 'endDate']);
                const createdVehicleBooking = await prisma.vehicleBooking.create({
                    data: {
                        ...updateData,
                        startDate: utility.covertDateToISOString(setStartDate),
                        endDate: utility.covertDateToISOString(setEndDate),
                        vehicle: { connect: { id: vehicleId } },
                        user: { connect: { id: user?.id } }
                    },
                    include: {
                        vehicle: true
                    }
                })
                return createdVehicleBooking
            }
        } else {
            throw successAndErrors.addFailure(`Vehicle is already booked on ${foundDates.join(', ')}, Booking`);
        }
    } catch (error: any) {
        throw successAndErrors.addFailure(error?.message ?? 'Vehicle is not available, Please book another vehicle, Booking');
    }
}

const getAllBookings = async (user: any) => {
    try {
        const todayStartDay = utility.getStartDayOfCurrentDay();

        const allBookings = await prisma.vehicleBooking.findMany({
            where: {
                OR: [{ startDate: { gte: todayStartDay } },
                { endDate: { gte: todayStartDay } }
                ]
            }
        });
        const datesAlreadybooked = allBookings?.map(x =>
            utility.getDatesBetweenTwoDates(utility.getOnlyDate(x?.startDate), utility.getOnlyDate(x?.endDate)))
        const datesAlreadybookedFlatten = _.flatten(datesAlreadybooked);
       
        return allBookings
    } catch (error) {
        throw successAndErrors.getFailure('Get All Bookings');
    }
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

const addVehicleDiscount = async (body: any) => {
    try {
        const createdVehicleDiscount = await prisma.vehicleDiscount.create({
            data: body
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
            data: body
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
    pickedOnlyCalculateRentSelectedFields,
    addVehicleDiscount,
    listVehiclesDiscount,
    getVehicleDiscount,
    calculateRent,
    updateVehicleDiscount,
    pickedOnlyAddBookingSelectedFields,
    addBooking,
    getAllBookings,
    
}