import _ from "lodash";
import { Response, Request } from "express";

const throwError = (errorMessage: string, status?: number) => {
    throw { message: errorMessage, status };
};

const catchError = () => {
    // let error = e;
    // if (!error) error = new Error('Default error');
    // res.status(error.status || 500).json({
    //     type: 'error',
    //     message: error.message || 'Unhandled error',
    //     error
    // });
};

const sendSuccess = (res: Response, data: any, status?: number, message?: string) => {
    res.status(status ?? 200).json({
        type: 'success',
        message: message || 'Success result',
        data,
    });
};

const sendError = (res: Response, error: any) => {
    return res.status(error?.status ?? 500).json({
        type: 'error',
        message: error?.message ?? error ?? 'Unhandled Error'
    });
}

export default {
    sendSuccess,
    sendError,
    throwError
}