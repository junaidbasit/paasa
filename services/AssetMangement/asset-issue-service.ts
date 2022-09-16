import { prisma } from "../../utils/db";
import utility from "../../utils/utility";
import successAndErrors from "../../utils/successAndErrors";
import _ from "lodash";
import moment from "moment";



const createIssue = async (body: any) => {
    try {
        const { bundleId } = body;
        const createData: any = _.omit(body, ['bundleId']);

        const createdIssue = await prisma.issueAsset.create({
            data: {
                ...createData,
                bundle: { connect: { id: bundleId } },
                name: createData?.name ?? "",
                images: createData?.images ?? [],
                description: createData?.description ?? ""
            },
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
                        }
                    },
                }
            }
        });
        if (!_.isEmpty(createdIssue?.bundle) && !_.isNull(createdIssue?.bundle)) {
            return {
                ...pickedOnlyResultIssueSelectedFields(createdIssue),
                // ...createdIssue,
                bundle: {
                    ...pickedOnlyResultBookingSelectedFields(createdIssue?.bundle),
                    bookings: createdIssue?.bundle?.assetBookings?.map(x => ({
                        ...x,
                        startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
                        endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
                        bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
                    }))
                }
            }
        } else {
            throw successAndErrors.throwCustomMessage('Asset issue is not created, May be already issued asset, Please try again, Asset Issue');
        }
    }
    catch (error: any) {
        throw successAndErrors.addFailure(error?.message ?? 'Vehicle issue is not created, May be already issued vehicle, Please try again, Vehicle Issue');
    }
};

const getIssue = async (id: string) => {
    try {
        const issue = await prisma.issueAsset.findFirst({
            where: { id },
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
        if (!_.isNull(issue)) {
            let issueWithBooking: any = {
                ...pickedOnlyResultIssueSelectedFields(issue),
            };
            if (!_.isEmpty(issue?.bundle) && !_.isNull(issue?.bundle)) {
                issueWithBooking = {
                    ...issueWithBooking,
                    bundle: {
                        ...pickedOnlyResultBookingSelectedFields(issue?.bundle),
                        bookings: issue?.bundle?.assetBookings?.map(x => ({
                            ...x,
                            startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
                            endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
                            bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
                        }))
                    }
                }

            };
            if (!_.isEmpty(issue?.returnAsset) && !_.isNull(issue?.returnAsset)) {
                issueWithBooking = {
                    ...issueWithBooking,
                    returnAsset: issue?.returnAsset
                }
            }

            return issueWithBooking;
        } else {
            return issue
        }
    }
    catch (error: any) {
        throw successAndErrors.getFailure('Asset issue is not found, Please try again, Asset Issue');
    }
};
const getAllVehicleIssues = async (query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        const { skip, take } = pagination;
        const issues = await prisma.issueAsset.findMany({
            skip, take,
            orderBy: {
                createdAt: 'desc'
            },
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
        if (!_.isEmpty(issues)) {
            const issuesWithBooking = [];
            for (const issue of issues) {
                let issueWithBooking: any = {
                    ...pickedOnlyResultIssueSelectedFields(issue),
                };
                if (!_.isEmpty(issue?.bundle) && !_.isNull(issue?.bundle)) {
                    issueWithBooking = {
                        ...issueWithBooking,
                        bundle: {
                            ...pickedOnlyResultBookingSelectedFields(issue?.bundle),
                            bookings: issue?.bundle?.assetBookings?.map(x => ({
                                ...x,
                                startDate: utility.getOnlyDateFromUtcToLocal(x?.startDate),
                                endDate: utility.getOnlyDateFromUtcToLocal(x?.endDate),
                                bookingDate: utility.getOnlyDateFromUtcToLocal(x?.bookingDate)
                            }))
                        }
                    }

                };
                if (!_.isEmpty(issue?.returnAsset) && !_.isNull(issue?.returnAsset)) {
                    issueWithBooking = {
                        ...issueWithBooking,
                        returnAsset: issue?.returnAsset
                    }
                }
                issuesWithBooking.push(issueWithBooking);
            }
            return issuesWithBooking;
        } else {
            return issues;
        }
    }
    catch (error: any) {
        throw successAndErrors.getFailure('Asset issue is not found, Please try again, Asset Issue');
    }
};

const createReturn = async (body: any) => {
    try {
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

const createIssueReturnCharges = async (body: any) => {
    try {
        const createdReturnCharges = await prisma.vechicleIssueReturnCharges.create({
            data: {
                ...body,
            },
        });
        return createdReturnCharges;
    }
    catch (error: any) {
        throw successAndErrors.addFailure('Issue Return charges is not created, Please try again, Issue Return Charges');
    }
};

const getIssueReturnCharges = async () => {
    try {
        const returnCharges = await prisma.vechicleIssueReturnCharges.findFirst({ where: {} });
        return returnCharges;
    }
    catch (error: any) {
        throw successAndErrors.getFailure('Issue Return charges is not found, Please try again, Issue Return Charges');
    }
};

const updateIssueReturnCharges = async (body: any) => {
    try {
        const returnCharges = await prisma.vechicleIssueReturnCharges.findFirst({ where: {} });
        const updatedReturnCharges = await prisma.vechicleIssueReturnCharges.update({
            where: { id: returnCharges?.id },
            data: {
                ...body,
            },
        });
        return updatedReturnCharges;
    }
    catch (error: any) {
        throw successAndErrors.updateFailure('Issue Return charges is not updated, Please try again, Issue Return Charges');
    }
};

const twoDecimelFormat = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

const calculateReturnCharges = async (body: any) => {
    try {
        const returnCharges = await prisma.vechicleIssueReturnCharges.findFirst({ where: {} });
        const vehicleIssue = await prisma.issueVechicle.findFirst({
            where: { id: body?.vehicleIssueId },
            include: {
                booking: {
                    include: {
                        vehicle: true,
                    }
                }
            }
        });
        if (_.isEmpty(returnCharges) || _.isNull(returnCharges) || _.isEmpty(vehicleIssue) || _.isNull(vehicleIssue) || _.isEmpty(vehicleIssue?.booking) || _.isNull(vehicleIssue?.booking)) {
            throw successAndErrors.addFailure('Issue Return charges is Calculated, Please try again, Issue Return Charges');
        } else {
            const millage = body?.currentOdoReading - vehicleIssue?.odoMeterReading;
            const charges = {
                extraDays: 0,
                extraMillage: 0,
                extraMillageCharges: 0,
                extraDaysCharges: 0
            };
            //&& millage <= returnCharges?.millageLimitCrossed) {
            if (millage > returnCharges?.millageLimit) {
                charges.extraMillage = parseFloat(twoDecimelFormat(millage - returnCharges?.millageLimit));
                charges.extraMillageCharges = parseFloat(twoDecimelFormat(charges.extraMillage * returnCharges?.perKmMillageLimitCharges));
            }
            // else if (millage > returnCharges?.millageLimitCrossed) {
            //     charges.extraMillage = parseFloat(utility.formatCharges(millage - returnCharges?.millageLimitCrossed));
            //     charges.extraMillageCharges = parseFloat(utility.formatCharges(charges.extraMillage * returnCharges?.perKmMillageLimitCrossedCharges));
            // }
            const onlyStartDate = moment(vehicleIssue?.booking?.startDate);
            const onlyEndDate = moment(vehicleIssue?.booking?.endDate);
            const bookingDays = onlyEndDate.diff(onlyStartDate, 'days') + 1 // 1
            const todayDate = moment();
            const diffrence = todayDate.diff(onlyStartDate, 'days') + 1; // 1
            if (diffrence > bookingDays) {
                charges.extraDays = diffrence - bookingDays;
                charges.extraDaysCharges = parseFloat(twoDecimelFormat(charges?.extraDays * vehicleIssue?.booking?.vehicle?.dailyRent));
            }
            return charges;
        }
    }
    catch (error: any) {
        throw successAndErrors.addFailure('Issue Return charges is not found, Please try again, Issue Return Charges');
    }
}

const calulateFinalCharges = async (body: any) => {
    try {
        const vehicleIssue = await prisma.issueVechicle.findFirst({
            where: { id: body?.vehicleIssueId },
            include: {
                booking: {
                    include: {
                        vehicle: true,
                    }
                }
            }
        });
        const securityCharges = vehicleIssue?.booking?.vehicle?.securityDeposit;
        // const securityCharges = 175;

        if (!securityCharges) {
            throw successAndErrors.getFailure('Security Deposit is not found in vehicle, Please try again, Security Deposit');
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

        adjustments?.every((item: any) => item.age === 15)
        let totalCharges = adjustments?.reduce((accum: any, item: any) => accum + item?.adjustment, 0);
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
                // value: single?.adjustment,
                value: single?.charges,
                adjustment: adjustment,
                finalValue: single?.adjustment
                // adjustment > 0 ? single?.adjustment + adjustment :
                //     adjustment < 0 ? single?.adjustment - adjustment : single?.adjustment
            };
            returnCharges.push(calculated)
        }

        returnCharges.push({ source: 'Charges', adjustment: 0, value: parseFloat(twoDecimelFormat(totalCharges)) });
        returnCharges.push({ source: 'Security Deposit', adjustment: 0, value: parseFloat(twoDecimelFormat(securityCharges)) });
        returnCharges.push({ source: 'Receivable', adjustment: 0, value: parseFloat(twoDecimelFormat(recieveable)) });
        returnCharges.push({ source: 'Payable', adjustment: 0, value: parseFloat(twoDecimelFormat(payable)) });
        return returnCharges;
    }
    catch (error: any) {
        throw successAndErrors.getFailure(error?.message ?? 'Return Charges not calculates, Please try again, Return Charges');
    }
}


const pickedOnlyCalculateReturnChargesFields = (body: any) => {
    return _.pick(body, ["currentOdoReading", "vehicleIssueId"]);
}

const pickedOnlyCalculateFinalChargesFields = (body: any) => {
    return _.pick(body, ["vehicleIssueId", "adjustments"]);
}

const pickedOnlyCreateIssueReturnChargesFields = (body: any) => {
    return _.pick(body, ['perDayExtraCharge', 'clearanceCharges', 'millageLimit',
        'perKmMillageLimitCharges', 'millageLimitCrossed', 'perKmMillageLimitCrossedCharges'])
};

const pickedOnlyCreateIssueFields = (body: any) => {
    return _.pick(body, ['name', 'description', 'images', 'bundleId']);
};

const pickedOnlyResultIssueSelectedFields = (body: any) => {
    return _.pick(body, ["id", 'name', 'description', 'images']);
};


const pickedOnlyCreateReturnFields = (body: any) => {
    return _.pick(body, ['name', 'odoMeterReading', 'adjustmentNote', 'demagesImages', "demagesAdjustments", 'fuelCapacity', 'bookingStartDate',
        'bookingEndDate', 'returnedDate', 'issueVechicleId', "receipt"])
};

const pickedOnlyResultBookingSelectedFields = (body: any) => {
    return _.pick(body, ["id", 'firstName', 'lastName', 'phoneNumber', 'email', 'address', 'amountCharged', 'bookingReason', 'isAcceptedTerms', "paymentStatus", "approvedStatus", "user"])
}

export {
    createIssue,
    getIssue,
    getAllVehicleIssues,
    pickedOnlyCreateIssueFields,
    pickedOnlyCreateReturnFields,
    getAllVehicleReturns,
    createReturn,
    getReturn,
    createIssueReturnCharges,
    pickedOnlyCreateIssueReturnChargesFields,
    getIssueReturnCharges,
    updateIssueReturnCharges,
    calculateReturnCharges,
    pickedOnlyCalculateReturnChargesFields,
    pickedOnlyCalculateFinalChargesFields,
    calulateFinalCharges
}