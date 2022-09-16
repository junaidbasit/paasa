import { prisma } from "../../utils/db";
import successAndErrors from "../../utils/successAndErrors";
import _ from "lodash";
import utility from "../../utils/utility";
import { PaymentStatus, ApprovedStatus, Asset } from '@prisma/client';
import moment from "moment";

const pickedOnlySelectedFields = (body: any) => {
    return _.pick(body, ['name', 'image', 'description', "dailyRent", "isAvailable", "securityDeposit"])
};

const addAsset = async (body: any) => {
    try {
        const createdAsset = await prisma.asset.create({
            data: {
                ...body
            }
        })
        return createdAsset
    } catch (error) {
        throw successAndErrors.addFailure('Asset')
    }
};

const listAssets = async () => {
    try {
        const todayStartDay = utility.getStartDayOfCurrentDay();
        const allAssets = await prisma.asset.findMany({
            where: {
                isAvailable: true
            },
            include: {
                assetBooking: {
                    where: {
                        OR: [{ startDate: { gte: todayStartDay } }, { endDate: { gte: todayStartDay } }]
                    },
                    include: {
                        assetBookingBundle: true
                    }
                }
            },
            orderBy: {
                name: "asc"
            }
        });
        const assets = allAssets?.filter(x => _.isEmpty(x?.assetBooking) || (!_.isEmpty(x?.assetBooking) && (x?.assetBooking?.some(x =>
            x?.assetBookingBundle?.approvedStatus == ApprovedStatus.APPROVED || x?.assetBookingBundle?.approvedStatus == ApprovedStatus.PENDING))));

        const assetsWithBooking: Array<any> = [];
        for (const single of assets) {
            const assetBooking = single?.assetBooking ?? [];
            const datesAlreadybooked = assetBooking?.map(x =>
                utility.getDatesBetweenTwoDates(utility.getOnlyDate(x?.startDate), utility.getOnlyDate(x?.endDate)))
            const datesAlreadybookedFlatten = _.flatten(datesAlreadybooked);
            const asset = {
                ...pickedOnlySelectedFields(single),
                id: single?.id,
                datesAlreadybooked: datesAlreadybookedFlatten ?? []
            };
            assetsWithBooking.push(asset);
        };
        return assetsWithBooking
    } catch (error) {
        throw successAndErrors.getFailure('Assets')
    }
}

const listAssetsByAdmin = async () => {
    try {
        const allAssets = await prisma.asset.findMany({
            where: {},
            orderBy: {
                updatedAt: "desc"
            }
        });
        return allAssets;
    } catch (error) {
        throw successAndErrors.getFailure('Assets')
    }
}


const getAsset = async (id: string) => {
    try {
        return await prisma.asset.findFirst({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Assets')
    }
}
const updateAsset = async (id: string, body: any) => {
    try {
        return await prisma.asset.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Assets')
    }
}
const deleteAsset = async (id: string) => {
    try {
        const findout = await prisma.asset.findFirst({
            where: {
                id: id
            },
            include: {
                assetBooking: true
            }
        })
        if (!_.isEmpty(findout) && _.isEmpty(findout?.assetBooking)) {
            return await prisma.asset.delete({
                where: { id: id }
            })
        } else {
            const assetBooking = findout?.assetBooking ?? [];
            const datesAlreadybooked = assetBooking?.map(x =>
                utility.getDatesBetweenTwoDates(utility.getOnlyDate(x?.startDate), utility.getOnlyDate(x?.endDate)))
            const datesAlreadybookedFlatten = _.flatten(datesAlreadybooked);

            successAndErrors.throwCustomMessage(`This asset contain booking on dates ${datesAlreadybookedFlatten?.join(",")}, Please delete booking before to delete Asset, Asset`)
        }

    } catch (error: any) {
        throw successAndErrors.deleteFailure(error?.customMessage ?? 'Asset')
    }
}

export {
    deleteAsset,
    updateAsset,
    getAsset,
    listAssets,
    addAsset,
    listAssetsByAdmin,
    pickedOnlySelectedFields
}