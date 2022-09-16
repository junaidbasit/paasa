import { prisma } from "../utils/db";
import successAndErrors from "../utils/successAndErrors";
// import { Vehicle } from '@prisma/client';
import _ from "lodash";

const addSlider = async (body: any) => {
    try {
        const createdSlider = await prisma.slider.create({
            data: {
                ...body
            }
        })
        return createdSlider
    } catch (error) {
        console.log(error)
        throw successAndErrors.addFailure('Slider')
    }
}
const listSlider = async () => {
    try {
        return await prisma.slider.findMany({
            where: {},
            orderBy: {
                sequence: "asc"
            }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Slider')

    }
}

const getSlider = async (id: string) => {
    try {
        return await prisma.slider.findFirst({
            where: { id: id }
        })
    } catch (error) {
        throw successAndErrors.getFailure('Slider')
    }
}
const updateSlider = async (id: string, body: any) => {
    try {
        return await prisma.slider.update({
            where: { id: id },
            data: body
        })
    } catch (error) {
        throw successAndErrors.updateFailure('Slider')
    }
}
const deleteSlider = async (id: string) => {
    try {
        return await prisma.slider.delete({
            where: { id: id }
        })
    } catch (error: any) {
        throw successAndErrors.deleteFailure(error?.customMessage ?? 'Slider')
    }
}

export {
    addSlider,
    listSlider,
    getSlider,
    updateSlider,
    deleteSlider
}
