import { prisma } from "../utils/db";
import utility from "../utils/utility";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import moment from "moment";
import firebase from "../config/firebase-config";
import { v4 as uuidv4 } from 'uuid';

const uploadFileAndGetURL = (file: Express.Multer.File) => {
    const newFileName = new Date().getTime().toString() + file?.originalname;

    const blob = firebase.file(newFileName);
    return new Promise((resolve, reject) => {
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file?.mimetype,
                firebaseStorageDownloadTokens: uuidv4()
            },
            public: true,
            validation: "md5"
        });
        blobWriter.on('error', (err) => {
            resolve({
                isUpload: false, message: 'error from image upload '.concat(err?.message ?? err?.name),
                originalFileName: file?.originalname
            });
            // reject('error from image upload '.concat(err?.message ?? err?.name))
        });
        blobWriter.on('finish', async () => {
            // console.log("text", blob?.publicUrl());
            // console.log("metadata", blob?.metadata);


            // The file upload is complete.
            // const signedUrls = await blob.getSignedUrl({
            //     action: 'read',
            //     expires: moment().add(3, 'years').toDate()
            // });url: signedUrls[0],
            resolve({
                isUpload: true, url: blob?.publicUrl(),
                originalFileName: file?.originalname
            })
        });
        blobWriter.end(file?.buffer)
    })
};


const uploadImagesToCloudAndGetUrls = async (files: Array<Express.Multer.File>) => {
    let imagesUploadPromise = [];
    for (const file of files) {
        imagesUploadPromise.push(uploadFileAndGetURL(file));
        // imagesURLs.push({
        //     thumbnail: await this.fileService.createThumbnailAndUpload(file),
        //     orignalImage: await this.fileService.uploadFileAndGetURL(file)
        // });
    };
    const uploadImages: Array<any> = await Promise.all(imagesUploadPromise);
    const successImages = [];
    const failedImages = [];
    for (const image of uploadImages) {
        if (image?.isUpload) {
            successImages.push(image);
        } else {
            failedImages.push(image);

        }
    };
    return { successImages, failedImages };
};

const createIssue = async (body: any) => {
    try {

        const { bookingId } = body;
        const createData: any = _.omit(body, ['bookingId']);

        const createdVehicleIssue = await prisma.issueVechicle.create({
            data: {
                // ...updateData,
                ...createData,
                booking: { connect: { id: bookingId } },
            },
            include: {
                booking: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        },
                        vehicle: true
                    }
                }

            }
        });
        if (!_.isEmpty(createdVehicleIssue?.booking) && !_.isNull(createdVehicleIssue?.booking)) {
            return {
                ...createdVehicleIssue,
                booking: {
                    ...createdVehicleIssue?.booking,
                    startDate: utility.getOnlyDateFromUtcToLocal(createdVehicleIssue?.booking?.startDate),
                    endDate: utility.getOnlyDateFromUtcToLocal(createdVehicleIssue?.booking?.endDate),
                    bookingDate: utility.getOnlyDateFromUtcToLocal(createdVehicleIssue?.booking?.bookingDate)
                },
            }
        } else {
            return createdVehicleIssue
        }
    }
    catch (error: any) {
        throw successAndErrors.addFailure('Vehicle issue is not created, May be already issued vehicle, Please try again, Vehicle Issue');
    }
};

const getIssue = async (id: string) => {
    try {
        const issue = await prisma.issueVechicle.findFirst({
            where: { id },
            include: {
                booking: true,
                ReturnVechicle: true
            }
        });
        if (!_.isNull(issue)) {
            let issueWithBooking: any = {
                ...issue
            };
            if (!_.isEmpty(issue?.booking) && !_.isNull(issue?.booking)) {
                issueWithBooking = {
                    booking: {
                        ...issue.booking,
                        startDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.startDate),
                        endDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.endDate),
                        bookingDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.bookingDate)
                    },
                }
            }
            if (!_.isEmpty(issue?.ReturnVechicle) && !_.isNull(issue?.ReturnVechicle)) {
                issueWithBooking = {
                    ...issueWithBooking,
                    ReturnVechicle: {
                        ...issue?.ReturnVechicle,
                        bookingStartDate: utility.getOnlyDateFromUtcToLocal(issue?.ReturnVechicle?.bookingStartDate),
                        bookingEndDate: utility.getOnlyDateFromUtcToLocal(issue?.ReturnVechicle?.bookingEndDate),
                        returnedDate: utility.getOnlyDateFromUtcToLocal(issue?.ReturnVechicle?.returnedDate)
                    }
                }
            }
            return issueWithBooking;
        } else {
            return issue
        }
    }
    catch (error: any) {
        throw successAndErrors.addFailure('Vehicle issue is not found, Please try again, Vehicle Issue');
    }
};
const getAllVehicleIssues = async (query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        const { skip, take } = pagination;
        const issues = await prisma.issueVechicle.findMany({
            skip, take,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                booking: {
                    include: {
                        vehicle: true
                    }
                },
                ReturnVechicle: true
            }
        });
        if (!_.isEmpty(issues)) {
            const issuesWithBooking = [];
            for (const issue of issues) {
                let issuesWithBookingAndReturn = {};
                if (!_.isNull(issue?.booking) && !_.isEmpty(issue?.booking)) {
                    issuesWithBookingAndReturn = {
                        booking: {
                            ...issue?.booking,
                            startDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.startDate),
                            endDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.endDate),
                            bookingDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.bookingDate)
                        },
                    }
                }
                if (!_.isNull(issue?.ReturnVechicle) && !_.isEmpty(issue?.ReturnVechicle)) {
                    issuesWithBookingAndReturn = {
                        ...issuesWithBookingAndReturn,
                        ReturnVechicle: {
                            ...issue?.ReturnVechicle,
                            bookingStartDate: utility.getOnlyDateFromUtcToLocal(issue?.ReturnVechicle?.bookingStartDate),
                            bookingEndDate: utility.getOnlyDateFromUtcToLocal(issue?.ReturnVechicle?.bookingEndDate),
                            returnedDate: utility.getOnlyDateFromUtcToLocal(issue?.ReturnVechicle?.returnedDate),
                        }
                    }
                }
                issuesWithBooking.push({
                    ...issue,
                    ...issuesWithBookingAndReturn,
                })
            }
            return issuesWithBooking;
        } else {
            return issues;
        }
    }
    catch (error: any) {
        throw successAndErrors.addFailure('Vehicle issue is not found, Please try again, Vehicle Issue');
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
}

const pickedOnlyCreateIssueFields = (body: any) => {
    return _.pick(body, ['odoMeterReading', 'name', 'description', 'fuelCapacity', 'images', 'bookingId']);
};

const pickedOnlyCreateReturnFields = (body: any) => {
    return _.pick(body, ['name', 'odoMeterReading', 'adjustmentNote', 'demagesImages', "demagesAdjustments", 'fuelCapacity', 'bookingStartDate',
        'bookingEndDate', 'returnedDate', 'issueVechicleId', "receipt"])
};

export {
    createIssue,
    getIssue,
    getAllVehicleIssues,
    pickedOnlyCreateIssueFields,
    pickedOnlyCreateReturnFields,
    getAllVehicleReturns,
    uploadFileAndGetURL,
    uploadImagesToCloudAndGetUrls,
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