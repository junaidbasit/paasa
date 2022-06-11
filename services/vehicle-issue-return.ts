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
                booking: true,
            }
        });
        if (!_.isEmpty(createdVehicleIssue?.booking) && !_.isNull(createdVehicleIssue?.booking)) {
            return {
                ...createdVehicleIssue,
                booking: {
                    ...createdVehicleIssue.booking,
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
        throw successAndErrors.addFailure('Vehicle issue is not created, Please try again, Vehicle Issue');
    }
};

const getIssue = async (id: string) => {
    try {
        const issue = await prisma.issueVechicle.findFirst({
            where: { id },
            include: {
                booking: true,
            }
        });
        if (!_.isNull(issue) && !_.isEmpty(issue?.booking) && !_.isNull(issue?.booking)) {
            return {
                ...issue,
                booking: {
                    ...issue.booking,
                    startDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.startDate),
                    endDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.endDate),
                    bookingDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.bookingDate)
                },
            }
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
                booking: true,
            }
        });
        if (!_.isEmpty(issues)) {
            const issuesWithBooking = [];
            for (const issue of issues) {
                if (!_.isNull(issue?.booking) && !_.isEmpty(issue?.booking)) {
                    issuesWithBooking.push({
                        ...issue,
                        booking: {
                            ...issue.booking,
                            startDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.startDate),
                            endDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.endDate),
                            bookingDate: utility.getOnlyDateFromUtcToLocal(issue?.booking?.bookingDate)
                        },
                    })
                } else {
                    issuesWithBooking.push(issue)
                }
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
                        booking: true,
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
                        booking: true,
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
                        booking: true,
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

const pickedOnlyCreateIssueReturnChargesFields = (body: any) => {
    return _.pick(body, ['perDayExtraCharge', 'clearanceCharges', 'millageLimit',
        'perKmMillageLimitCharges', 'millageLimitCrossed', 'perKmMillageLimitCrossedCharges'])
}

const pickedOnlyCreateIssueFields = (body: any) => {
    return _.pick(body, ['odoMeterReading', 'name', 'description', 'fuelCapacity', 'images', 'bookingId']);
};

const pickedOnlyCreateReturnFields = (body: any) => {
    return _.pick(body, ['name', 'odoMeterReading', 'adjustmentNote', 'demagesImages', "demagesAdjustments", 'fuelCapacity', 'bookingStartDate',
        'bookingEndDate', 'returnedDate', 'issueVechicleId'])
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
}