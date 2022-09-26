import { prisma } from "../../utils/db";
import utility from "../../utils/utility";
import successAndErrors from "../../utils/successAndErrors";
import _ from "lodash";
import moment from "moment";
import { UserRole } from "../../types/enums";
import { PaymentStatus, ApprovedStatus } from '@prisma/client';


const pickedOnlyCalculateRentSelectedFields = (body: any) => {
    return _.pick(body, ['startDate', 'endDate', 'assetId'])
};


const pickOnlyUpdateBookingSelectedFields = (body: any) => {
    return _.pick(body, ['approvedStatus', 'paymentStatus'])
};

const pickedOnlyAddBookingSelectedFields = (body: any) => {
    return _.pick(body, ['bookings', 'firstName', 'lastName', 'phoneNumber', 'email', 'address', 'amountCharged', 'bookingReason', 'isAcceptedTerms'])
}
const pickedOnlyResultBookingSelectedFields = (body: any) => {
    return _.pick(body, ["id", 'firstName', 'lastName', 'phoneNumber', 'email', 'address', 'amountCharged', 'bookingReason', 'isAcceptedTerms', "paymentStatus", "approvedStatus", "user"])
}

const twoDecimelFormat = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

const addAssetToBundle = async (body: any, user?: any) => {
    try {
        const { startDate, endDate, assetId } = body;
        const asset = await prisma.asset.findFirst({
            where: { id: assetId },

        })
        if (!_.isEmpty(asset) && !_.isNull(asset) && asset?.isAvailable === true) {
            const bookingEndDate = moment(endDate, "DD-MM-YYYY");
            const bookingStartDate = moment(startDate, "DD-MM-YYYY");
            const bookingDays = bookingEndDate.diff(bookingStartDate, 'days') + 1 // 1
            if (bookingDays > 7) {
                throw successAndErrors.throwCustomMessage('Booking days should be equal or less than 7, Not add to cart');
            };
            const bookingPrice = asset?.dailyRent * bookingDays;
            const totalPriceWithSecurity = bookingPrice + asset?.securityDeposit;
            return {
                securityDeposit: parseFloat(asset?.securityDeposit?.toString()),
                bookingDays,
                perDayPrice: asset?.dailyRent,
                bookingPrice: parseFloat(twoDecimelFormat(bookingPrice)),
                totalPriceWithSecurity: parseFloat(twoDecimelFormat(totalPriceWithSecurity))
            }
        } else {
            successAndErrors.throwCustomMessage("Asset is not available, Please book another asset, ")
        }
    } catch (error: any) {
        throw successAndErrors.failWithCustomMessage(error?.customMessage ?? 'An error occured while add to cart')
    }
};

const checkBookingAvaiable = async (body: any, user: any) => {
    const { startDate, endDate, assetId } = body;
    const onlyStartDate = moment(startDate, "DD-MM-YYYY");
    const onlyEndDate = moment(endDate, "DD-MM-YYYY");
    const bookingDays = onlyEndDate.diff(onlyStartDate, 'days') + 1 // 1
    if (bookingDays > 7) {
        throw successAndErrors.getFailure('Booking days should be less than 7');
    };

    const setStartDate = utility.setStartDayTimeToDate(startDate);
    const setEndDate = utility.setEndDayTimeToDate(endDate);
    const todayStartDay = utility.getStartDayOfCurrentDay();
    const bookings = await prisma.assetBooking.findMany({
        where: {
            AND: [{ OR: [{ startDate: { gte: todayStartDay } }, { endDate: { gte: todayStartDay } }] },
            { assetId },]
        },
        include: {
            assetBookingBundle: true
        }
    });
    const alreadyBooking = bookings?.filter(x => x?.assetBookingBundle?.approvedStatus == ApprovedStatus.APPROVED || x?.assetBookingBundle?.approvedStatus == ApprovedStatus.PENDING);

    const datesWantToBook = utility.getDatesBetweenTwoDates(setStartDate, setEndDate);
    const datesAlreadybooked = alreadyBooking?.map(x =>
        utility.getDatesBetweenTwoDates(utility.getOnlyDate(x?.startDate), utility.getOnlyDate(x?.endDate)))
    const datesAlreadybookedFlatten = _.flatten(datesAlreadybooked);
    const foundDates = _.intersection(datesWantToBook, datesAlreadybookedFlatten);
    if (_.isEmpty(alreadyBooking) || _.isEmpty(foundDates)) {
        if (UserRole.SUPER_ADMIN == user?.userRole) {
            return { securityDeposit: 0, totalPriceWithSecurity: 0 };
        } else {
            const result = await addAssetToBundle(body);
            return {
                totalPriceWithSecurity: result?.totalPriceWithSecurity ?? 0,
                securityDeposit: result?.securityDeposit ?? 0
            }
        }
    } else {
        throw successAndErrors.addFailure(`Asset is already booked on ${foundDates.join(', ')}, Booking`);
    }
}

const confirmBooking = async (body: any, user: any) => {
    try {
        const { bookings } = body;
        let allBookingsCharge = 0;
        let securityDepositCharges = 0;

        const allBookingsData: any[] = []


        for (const single of bookings) {
            const { securityDeposit, totalPriceWithSecurity } = await checkBookingAvaiable(single, user);
            securityDepositCharges = securityDepositCharges + securityDeposit;
            allBookingsCharge = allBookingsCharge + totalPriceWithSecurity;
            const setStartDate = utility.setStartDayTimeToDate(single?.startDate);
            const setEndDate = utility.setEndDayTimeToDate(single?.endDate);
            allBookingsData.push({
                startDate: utility.covertDateToISOString(setStartDate),
                endDate: utility.covertDateToISOString(setEndDate),
                assetId: single?.assetId
            });
        }
        const paymentStatus = UserRole.SUPER_ADMIN == user?.userRole ?
            PaymentStatus.SUCCESS : PaymentStatus.PENDING;
        const bookingStatus = UserRole.SUPER_ADMIN == user?.userRole ?
            ApprovedStatus.APPROVED : ApprovedStatus.PENDING;
        const updateData: any = _.omit(body, ['bookings', "amountCharged"]);
        return await prisma.assetBookingBundle.create({
            data: {
                ...updateData,
                paymentStatus: paymentStatus,
                approvedStatus: bookingStatus,
                securityCharged: securityDepositCharges,
                amountCharged: allBookingsCharge,
                user: { connect: { id: user?.id } },
                assetBookings: {
                    createMany: {
                        data: allBookingsData
                    }
                }
            }
        })
    } catch (error: any) {
        throw successAndErrors.failWithCustomMessage(error?.message ?? 'Asset booking not added, ');
    }
}

const getAllBookings = async (query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        const assetBundle = await prisma.assetBookingBundle.findMany({
            skip: pagination?.skip,
            take: pagination?.take,
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                assetBookings: true,
                issueAsset: true,
                user: true
            }
        });
        let result = [];
        for (const bundle of assetBundle) {
            const bundleResult = {
                ...pickedOnlyResultBookingSelectedFields(bundle),
                bookings: bundle?.assetBookings?.map(x => ({
                    ...x,
                    startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
                    endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
                    bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
                }))
            };
            result.push(bundleResult);
        };
        return result;
    } catch (error) {
        throw successAndErrors.getFailure('All bookings');
    }
}


const getCurrentUserBookings = async (user: any, query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        const assetBundle = await prisma.assetBookingBundle.findMany({
            skip: pagination?.skip,
            take: pagination?.take,
            orderBy: {
                updatedAt: 'desc'
            },
            where: {
                userId: user?.id
            },
            include: {
                assetBookings: true,
                issueAsset: true
            }
        });
        let result = [];
        for (const bundle of assetBundle) {
            const bundleResult = {
                ...pickedOnlyResultBookingSelectedFields(bundle),
                bookings: bundle?.assetBookings?.map(x => ({
                    ...x,
                    startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
                    endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
                    bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
                }))
            };
            result.push(bundleResult);
        };
        return result;
    } catch (error) {
        throw successAndErrors.getFailure('Get All Bookings of Current User');
    }
};

const getBookingById = async (id: string) => {
    const assetBundle = await prisma.assetBookingBundle.findFirst({
        where: { id: id },
        include: {
            assetBookings: true,
            issueAsset: true,
            user: true
        }
    });

    if (!_.isEmpty(assetBundle) && !_.isNull(assetBundle)) {
        return {
            ...pickedOnlyResultBookingSelectedFields(assetBundle),
            bookings: assetBundle?.assetBookings?.map(x => ({
                ...x,
                startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
                endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
                bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
            }))
        };
    }
};

const updateBooking = async (id: string, body: any) => {

    const assetBundle = await prisma.assetBookingBundle.update({
        where: { id: id },
        data: body,
        include: {
            assetBookings: true,
            issueAsset: true,
            user: true
        }
    });
    if (!_.isEmpty(assetBundle) && !_.isNull(assetBundle)) {
        return {
            ...pickedOnlyResultBookingSelectedFields(assetBundle),
            bookings: assetBundle?.assetBookings?.map(x => ({
                ...x,
                startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
                endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
                bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
            }))
        };
    }
};

export {
    confirmBooking,
    pickedOnlyCalculateRentSelectedFields,
    checkBookingAvaiable,
    addAssetToBundle,
    pickedOnlyAddBookingSelectedFields,
    pickOnlyUpdateBookingSelectedFields,
    getAllBookings,
    getCurrentUserBookings,
    getBookingById,
    updateBooking
}