import _ from "lodash";
import moment from "moment";
import { PaginationInput, Pagination } from "../types/interfaces";

export default {
    validateEmail(email: string) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            return true;
        } else {
            return false;
            // this.throwErrorIfValueNotFound(null, "Email is not validate,Please enter valid email.")
        }
    },
    validatePassword(password: string) {
        var re = /^(?=^.{3,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/;
        if (re.test(password)) {
            return true;
        } else {
            // this.throwErrorIfValueNotFound(null, "Password is not validate,Please enter valid password.")
        }
    },
    formatEmail(value: string) {
        return value?.trim()?.toLowerCase();
    },
    checkValueIsEmptyOrUndefined(value: any) {
        return _.isUndefined(value) || _.isNull(value) || _.isEmpty(value) ? true : false;
    },
    pickOnlyInterestedFields(data: any, fields: Array<string>) {
        return _.pick(data, fields);
    },
    setStartDayTimeToDate(date: string) {
        return moment(date, "DD-MM-YYYY").startOf("day").format("DD-MM-YYYYTHH:mm:ss");
    },
    setEndDayTimeToDate(date: string) {
        return moment(date, "DD-MM-YYYY").endOf("day").format("DD-MM-YYYYTHH:mm:ss");
    },
    getStartDayOfCurrentDay() {
        return moment().startOf("day").toISOString();
    },
    getOnlyDate(date: string | Date) {
        return moment(date).format("DD-MM-YYYY");
    },
    getOnlyDateFromUtcToLocal(date: string | Date) {
        return moment.utc(date).local().format("DD-MM-YYYY");
    },
    covertDateToISOString(date: string | Date) {
        return moment(date, "DD-MM-YYYYTHH:mm:ss").toISOString();
    },
    getDatesBetweenTwoDates(startDate: string | Date, endDate: string | Date) {
        const dates = [];

        let currDate = moment(startDate, "DD-MM-YYYY").startOf('day');
        let lastDate = moment(endDate, "DD-MM-YYYY").startOf('day');

        while (currDate.diff(lastDate) <= 0) {
            dates.push(currDate.clone().format("DD-MM-YYYY"));
            currDate = currDate.clone().add(1, 'days');
        }

        return dates;
    },
    getSkipAndTakeFromQuery(query: any) {
        const paginationInput: PaginationInput = _.pick(query, ['page', 'limit']);
        const page = parseInt(paginationInput?.page || "1"),
            limit = parseInt(paginationInput?.limit || "10"),
            skip = (page - 1) > -1 ? (page - 1) * limit : 0;
        return <Pagination>{ take: limit, skip };
    }
    // .add(time, 'hours').format("DD-MM-YYYY HH:mm:ss");

    // throwErrorIfValueNotFound(value: any, errorMessage: string) {
    //     if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)) {
    //         return requestHandler.throwError(
    //             NotFound.status,
    //             NotFound.error,
    //             errorMessage
    //         )();
    //     }
}