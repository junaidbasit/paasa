import { prisma } from "../utils/db";
import utility from "../utils/utility";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import moment from "moment";
import { UserRole } from "../types/enums";
import { PaymentStatus } from '@prisma/client';

const pickedOnlyCalculateRentSelectedFields = (body: any) => {
    return _.pick(body, ['startDate', 'endDate', 'vehicleId'])
};

const pickedOnlyAddBookingSelectedFields = (body: any) => {
    return _.pick(body, ['amountCharged', 'firstName', 'lastName', 'phoneNumber', 'emergencyPhoneNumber', 'email', 'address', 'nameOfDriver', 'driverLicenseNumber', 'bookingReason', 'isAcceptedTerms', 'startDate', 'endDate', 'vehicleId'])
};

const pickOnlyUpdateBookingSelectedFields = (body: any) => {
    return _.pick(body, ['isApproved', 'paymentStatus'])
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
                const paymentStatus = UserRole.SUPER_ADMIN == user?.userRole ?
                    PaymentStatus.SUCCESS : PaymentStatus.PENDING;
                const createdVehicleBooking = await prisma.vehicleBooking.create({
                    data: {
                        paymentStatus: paymentStatus,
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

// prisma.$use(async (params, next) => {
//     if (params.model == 'VehicleBooking' && params.action == 'findMany') {

//     }
//     return next(params)
// })

const getAllBookings = async (query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        const allBookings = await prisma.vehicleBooking.findMany({
            skip: pagination?.skip,
            take: pagination?.take,
            orderBy: {
                bookingDate: 'desc'
            },
            include: {
                vehicle: true,
                user: true
            }
        });
        return allBookings?.map(x => ({
            ...x,
            startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
            endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
            bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
        }));

    } catch (error) {
        throw successAndErrors.getFailure('Get All Bookings');
    }
};

const getBooking = async (id: string) => {
    try {
        const booking = await prisma.vehicleBooking.findFirst({
            where: { id: id },
            include: {
                user: true,
                vehicle: true
            }
        });
        if (!_.isEmpty(booking) && !_.isNull(booking)) {
            return {
                ...booking,
                startDate: utility.getOnlyDateFromUtcToLocal(booking?.startDate),
                endDate: utility.getOnlyDateFromUtcToLocal(booking?.endDate),
                bookingDate: utility.getOnlyDateFromUtcToLocal(booking?.bookingDate)
            }
        } else {
            throw successAndErrors.getFailure('Booking');
        }
    } catch (error) {
        throw successAndErrors.getFailure('Booking')
    }
}
const updateBooking = async (id: string, body: any) => {
    try {
        const booking = await prisma.vehicleBooking.update({
            where: { id: id },
            data: body,
            include: {
                user: true,
                vehicle: true
            }
        })
        if (!_.isEmpty(booking) && !_.isNull(booking)) {
            return {
                ...booking,
                startDate: utility.getOnlyDateFromUtcToLocal(booking?.startDate),
                endDate: utility.getOnlyDateFromUtcToLocal(booking?.endDate),
                bookingDate: utility.getOnlyDateFromUtcToLocal(booking?.bookingDate)
            }
        } else {
            throw successAndErrors.updateFailure('Booking');
        }
    } catch (error) {
        throw successAndErrors.updateFailure('Booking')
    }
}
const deleteBooking = async (id: string) => {
    try {
        const booking = await prisma.vehicleBooking.delete({
            where: { id: id }
        })
        if (!_.isEmpty(booking) && !_.isNull(booking)) {
            return {
                ...booking,
                startDate: utility.getOnlyDateFromUtcToLocal(booking?.startDate),
                endDate: utility.getOnlyDateFromUtcToLocal(booking?.endDate),
                bookingDate: utility.getOnlyDateFromUtcToLocal(booking?.bookingDate)
            }
        } else {
            throw successAndErrors.deleteFailure('Booking');
        }
    } catch (error) {
        throw successAndErrors.deleteFailure('Booking')
    }
}



export {
    deleteBooking,
    updateBooking,
    getBooking,
    pickedOnlyCalculateRentSelectedFields,
    calculateRent,
    pickedOnlyAddBookingSelectedFields,
    addBooking,
    getAllBookings,
    pickOnlyUpdateBookingSelectedFields

}