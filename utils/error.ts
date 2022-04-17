import { extend } from 'lodash';

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
    
    // REST

    addFailure() {
        return extend({}, this.BadRequest, {
            message: 'Item WAS NOT added'
        });
    },
    deleteFailure() {
        return extend({}, this.BadRequest, {
            message: 'Item WAS NOT deleted'
        });
    },

    updateFailure() {
        return extend({}, this.BadRequest, {
            message: 'Item WAS NOT updated'
        });
    },

    addSuccess() {
        return extend({}, this.Success, {
            message: 'Item added successfully'
        });
    },

    deleteSuccess() {
        return extend({}, this.Success, {
            message: 'Item deleted successfully'
        });
    },

    updateSuccess() {
        return extend({}, this.Success, {
            message: 'Item updated successfully'
        });
    },

}