import { prisma } from "../../utils/db";
import utility from "../../utils/utility";
import successAndErrors from "../../utils/successAndErrors";
import _ from "lodash";
import moment from "moment";


const createReturn = async (body: any) => {
    try {
        //         name               String
        //   adjustmentNote     String?
        //   demagesImages      Json[]
        //   demagesAdjustments Json[]
        //   receipt            Json[]

        //   returnedDate DateTime

        const { issueVechicleId, bookingStartDate, bookingEndDate, returnedDate } = body;
        const setBookingStartDate = utility.setStartDayTimeToDate(bookingStartDate);
        const setBookingEndDate = utility.setEndDayTimeToDate(bookingEndDate);
        const setReturnedDate = utility.setStartDayTimeToDate(returnedDate);

        const createData: any = _.omit(body, ['issueVechicleId', 'bookingStartDate', 'bookingEndDate', 'returnedDate']);
        const createdReturn = await prisma.returnVechicle.create({
            data: {
                IssueVechicle: { connect: { id: issueVechicleId } },
                ...createData,
                bookingStartDate: utility.covertDateToISOString(setBookingStartDate),
                bookingEndDate: utility.covertDateToISOString(setBookingEndDate),
                returnedDate: utility.covertDateToISOString(setReturnedDate),
            },
            include: {
                IssueVechicle: {
                    include: {
                        booking: {
                            include: {
                                vehicle: true,
                                user: {
                                    include: {
                                        profile: true
                                    }
                                }
                            }
                        },
                    }
                }
            }
        });
        if (!_.isEmpty(createdReturn?.IssueVechicle) && !_.isNull(createdReturn?.IssueVechicle)) {
            return {
                ...createdReturn,
                bookingStartDate: utility.getOnlyDateFromUtcToLocal(createdReturn?.bookingStartDate),
                bookingEndDate: utility.getOnlyDateFromUtcToLocal(createdReturn?.bookingEndDate),
                returnedDate: utility.getOnlyDateFromUtcToLocal(createdReturn?.returnedDate),
                IssueVechicle: {
                    ...createdReturn.IssueVechicle,
                    booking: {
                        ...createdReturn.IssueVechicle.booking,
                        startDate: utility.getOnlyDateFromUtcToLocal(createdReturn?.IssueVechicle?.booking?.startDate),
                        endDate: utility.getOnlyDateFromUtcToLocal(createdReturn?.IssueVechicle?.booking?.endDate),
                        bookingDate: utility.getOnlyDateFromUtcToLocal(createdReturn?.IssueVechicle?.booking?.bookingDate)
                    },
                },
            }
        } else {
            return createdReturn
        }
    }
    catch (error: any) {
        console.log("error => ", error);

        throw successAndErrors.addFailure('Return is not created, Please try again, Return');
    }
};

const getReturn = async (id: string) => {
    try {
        const returnData = await prisma.returnVechicle.findFirst({
            where: { id },
            include: {
                IssueVechicle: {
                    include: {
                        booking: {
                            include: {
                                vehicle: true
                            }
                        },
                    }
                }
            }
        });
        if (!_.isNull(returnData) && !_.isEmpty(returnData?.IssueVechicle) && !_.isNull(returnData?.IssueVechicle)) {
            return {
                ...returnData,
                bookingStartDate: utility.getOnlyDateFromUtcToLocal(returnData?.bookingStartDate),
                bookingEndDate: utility.getOnlyDateFromUtcToLocal(returnData?.bookingEndDate),
                returnedDate: utility.getOnlyDateFromUtcToLocal(returnData?.returnedDate),
                IssueVechicle: {
                    ...returnData?.IssueVechicle,
                    booking: {
                        ...returnData?.IssueVechicle?.booking,
                        startDate: utility.getOnlyDateFromUtcToLocal(returnData?.IssueVechicle?.booking?.startDate),
                        endDate: utility.getOnlyDateFromUtcToLocal(returnData?.IssueVechicle?.booking?.endDate),
                        bookingDate: utility.getOnlyDateFromUtcToLocal(returnData?.IssueVechicle?.booking?.bookingDate)
                    },
                },
            }
        } else {
            return returnData;
        }
    }
    catch (error: any) {
        throw successAndErrors.addFailure('Return is not found, Please try again, Return');
    }
};

const getAllVehicleReturns = async (query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        const { skip, take } = pagination;
        const returns = await prisma.returnVechicle.findMany({
            skip, take,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                IssueVechicle: {
                    include: {
                        booking: {
                            include: {
                                vehicle: true
                            }
                        },
                    }
                }
            }
        });
        if (!_.isEmpty(returns)) {
            const returnsWithBooking = [];
            for (const returnData of returns) {
                if (!_.isNull(returnData?.IssueVechicle) && !_.isEmpty(returnData?.IssueVechicle)) {
                    returnsWithBooking.push({
                        ...returnData,
                        bookingStartDate: utility.getOnlyDateFromUtcToLocal(returnData?.bookingStartDate),
                        bookingEndDate: utility.getOnlyDateFromUtcToLocal(returnData?.bookingEndDate),
                        returnedDate: utility.getOnlyDateFromUtcToLocal(returnData?.returnedDate),
                        IssueVechicle: {
                            ...returnData?.IssueVechicle,
                            booking: {
                                ...returnData?.IssueVechicle?.booking,
                                startDate: utility.getOnlyDateFromUtcToLocal(returnData?.IssueVechicle?.booking?.startDate),
                                endDate: utility.getOnlyDateFromUtcToLocal(returnData?.IssueVechicle?.booking?.endDate),
                                bookingDate: utility.getOnlyDateFromUtcToLocal(returnData?.IssueVechicle?.booking?.bookingDate)
                            },
                        },
                    })
                } else {
                    returnsWithBooking.push(returnData)
                }
            }
            return returnsWithBooking;
        } else {
            return returns;
        }
    }
    catch (error: any) {
        throw successAndErrors.addFailure('Return is not found, Please try again, Return');
    }
};

const twoDecimelFormat = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}


const calulateFinalCharges = async (body: any) => {
    try {
        const { assetIssueId, returnDate } = body;
        const issue = await prisma.issueAsset.findFirst({
            where: { id: assetIssueId },
            include: {
                bundle: {
                    include: {
                        assetBookings: {
                            include: {
                                asset: true
                            }
                        },
                        user: {
                            include: {
                                profile: true
                            }
                        },
                    },
                },
                returnAsset: true,
            }
        });

        if (!_.isNull(issue) && !_.isEmpty(issue?.bundle) && !_.isNull(issue?.bundle)) {
            const securityCharges = issue?.bundle?.securityCharged;
            const amountCharged = issue?.bundle?.amountCharged;

            if (!securityCharges) {
                throw successAndErrors.failWithCustomMessage('Security Deposit is not found in booking. ');
            };

            const adjustments = body?.adjustments ?? [];
            if (_.isEmpty(adjustments)) {
                throw successAndErrors.getFailure('Please provide adjustments data, Charges');
            };

            let message = "";
            for (const single of adjustments) {
                if (single?.hasOwnProperty('source')) {
                    message = !single?.hasOwnProperty('charges') ? message?.concat(`${single?.source} not include charges ,`) : message;
                    message = !single?.hasOwnProperty('adjustment') ? message?.concat(`${single?.source} not include adjustment , `) : message;
                } else {
                    message = message?.concat(", An object not include source")
                }
            }
            if (!_.isEmpty(message)) {
                throw successAndErrors.getFailure(`Please fix these missing data ${message}, Charges`);
            }

            let totalCharges = adjustments?.reduce((accum: any, item: any) => accum + item?.adjustment, 0);
            totalCharges = totalCharges + amountCharged;

            let payable = 0;
            let recieveable = 0;
            if (totalCharges > 0 && totalCharges > securityCharges) {
                recieveable = totalCharges - securityCharges;
            } else if (totalCharges > 0 && totalCharges <= securityCharges) {
                payable = securityCharges - totalCharges;
            } else if (totalCharges == 0) {
                payable = securityCharges;
            }

            let returnCharges = [];
            for (const single of adjustments) {
                const adjustment = single?.adjustment - single?.charges;
                const calculated = {
                    source: single?.source,
                    value: single?.charges,
                    adjustment: adjustment,
                    finalValue: single?.adjustment
                };
                returnCharges.push(calculated)
            };

            returnCharges.push({ source: 'Charges', adjustment: 0, value: parseFloat(twoDecimelFormat(totalCharges)) });
            returnCharges.push({ source: 'Security Deposit', adjustment: 0, value: parseFloat(twoDecimelFormat(securityCharges)) });
            returnCharges.push({ source: 'Receivable', adjustment: 0, value: parseFloat(twoDecimelFormat(recieveable)) });
            returnCharges.push({ source: 'Payable', adjustment: 0, value: parseFloat(twoDecimelFormat(payable)) });
            return returnCharges;
        }
    }

    catch (error: any) {
        throw successAndErrors.getFailure(error?.message ?? 'Return Charges not calculates, Please try again, Return Charges');
    }
}

const pickedOnlyCalculateFinalChargesFields = (body: any) => {
    return _.pick(body, ["assetIssueId", "adjustments", "returnDate"]);
}

export {
    calulateFinalCharges,
    pickedOnlyCalculateFinalChargesFields
}