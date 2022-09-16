import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";
import utility from "../utils/utility";

const addCertificationWorkshop = async (body: any) => {
    try {
        const { date } = body;
        const dateIntoFormat = utility.setStartDayTimeToDate(date);
        const createdcertificate = await prisma.certificationWorkshop.create({
            data: {
                ...body,
                date: utility.covertDateToISOString(dateIntoFormat)
            }
        })
        return createdcertificate;
    } catch (error) {
        console.log(error)
        throw successAndErrors.addFailure('Certification Workshop')
    }
}
const listCertificationWorkshop = async (type: any) => {
    try {
        const list = await prisma.certificationWorkshop.findMany({
            where: _.isEmpty(type) ? {} : { type: type },
            orderBy: {
                createdAt: "desc"
            }
        });
        return list?.map(x => ({
            ...x,
            date: utility.getOnlyDateFromUtcToLocal(x?.date)
        }));

    } catch (error) {
        throw successAndErrors.getFailure('Certification Workshop')

    }
}

const getCertificationWorkshop = async (id: string) => {
    try {
        const single = await prisma.certificationWorkshop.findFirst({
            where: { id: id }
        });
        return { ...single, date: utility.getOnlyDateFromUtcToLocal(single?.date ?? "") }
    } catch (error) {
        throw successAndErrors.getFailure('Certification Workshop')
    }
}
const updateCertificationWorkshop = async (id: string, body: any) => {
    try {
        return await prisma.certificationWorkshop.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Certification Workshop')
    }
}
const deleteCertificationWorkshop = async (id: string) => {
    try {
        return await prisma.certificationWorkshop.delete({
            where: { id: id }
        })
    } catch (error: any) {
        throw successAndErrors.deleteFailure(error?.customMessage ?? 'Certification Workshop')
    }
}

export {
    addCertificationWorkshop,
    listCertificationWorkshop,
    getCertificationWorkshop,
    updateCertificationWorkshop,
    deleteCertificationWorkshop
}
