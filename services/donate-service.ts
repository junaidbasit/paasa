import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
import utility from "../utils/utility";
import _ from "lodash";

const addDonation = async (body: any) => {
    try {
        const createdDonate = await prisma.donate.create({
            data: {
                ...body
            }
        })
        return createdDonate
    } catch (error) {
        console.log(error)
        throw successAndErrors.addFailure(' Please fill complete data, Donation')
    }
}
const listDonations = async (query: any) => {
    try {
        const pagination = utility.getSkipAndTakeFromQuery(query);
        return await prisma.donate.findMany({
            where: {},
            orderBy: {
                createdAt: "desc"
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Donation')

    }
}

export {
    listDonations,
    addDonation
}
