import { extend, isEmpty } from 'lodash';

export default {
    BadRequest: {
        error: 'Bad Request',
        status: 400
    },
    Unauthorized: {
        error: 'Unauthorised',
        status: 401
    },

    Forbidden: {
        error: 'Forbidden',
        status: 403
    },

    NotFound: {
        error: 'Not Found',
        status: 404
    },

    Conflict: {
        error: 'Conflict',
        status: 409
    },

    UnprocessableEntity: {
        status: 422,
        error: 'Unprocessable Entity'
    },

    InternalServerError: {
        error: 'Internal Server Error',
        status: 500
    },

    Success: {
        error: '',
        status: 200
    },

    onlyAdmin: extend({}, {
        error: 'Forbidden',
        status: 403
    },
        { message: 'Only admins are allowed to do this!' }),

    NoPermesssion: extend(
        {},
        {
            error: 'Forbidden',
            status: 403,
            message: 'You do not have permission to consume this resource!'
        }
    ),

    // throwErrorIfValueNotFound1(value: any, errorMessage?: string) {
    //     if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)) {
    //         return requestHandler.throwError(
    //             NotFound.status,
    //             NotFound.error,
    //             errorMessage
    //         )();
    //     }
    // },
    returnErrorValueNotFound(entity: string) {

        return extend({}, this.BadRequest, {
            message: `${entity} is empty or not found, Please provide valid ${entity}`
        });
    },
    // REST

    addFailure(entity: string = 'Data') {
        return extend({}, this.BadRequest, {
            message: `${entity} WAS NOT added`
        });
    },
    deleteFailure(entity: string = 'Data') {
        return extend({}, this.BadRequest, {
            message: `${entity}  WAS NOT deleted`
        });
    },

    updateFailure(entity: string = 'Data') {
        return extend({}, this.BadRequest, {
            message: `${entity} WAS NOT updated`
        });
    },

    getFailure(entity: string = 'Data') {
        return extend({}, this.BadRequest, {
            message: `${entity} WAS NOT fetched`
        });
    },
    addSuccess(entity: string = 'Data') {
        return extend({}, this.Success, {
            message: `${entity} added successfully`
        });
    },

    deleteSuccess(entity: string = 'Data') {
        return extend({}, this.Success, {
            message: `${entity} deleted successfully`
        });
    },

    updateSuccess(entity: string = 'Data') {
        return extend({}, this.Success, {
            message: `${entity} updated successfully`
        });
    },

}