import * as SibApiV3Sdk from "@sendinblue/client"
import appConfig from "../config/app-config";
import { User, Profile, VehicleBooking, Vehicle, ReturnVechicle } from '@prisma/client';
import _ from "lodash";
import moment from "moment";

const testConnection = async () => {
    try {
        const apiInstance = emailInstance();
        const { body, response } = await apiInstance.getAccount();
        console.log("Connection Done");
    } catch (error) {
        console.log("Connection Failed");
    }
};

const emailInstance = () => {
    const apiInstance = new SibApiV3Sdk.AccountApi()
    apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, appConfig.sendinblueApiKey);
    return apiInstance;
};

const sendEmail = async (sendEmailData: any) => {

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, appConfig.sendinblueApiKey);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // sendSmtpEmail.subject = "{{params.subject}}";
    // sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";

    sendSmtpEmail.sender = { "name": "Passa Support", "email": "info@paasa.org.au" };
    sendSmtpEmail.to = sendEmailData?.to;
    // sendSmtpEmail.cc = [{ "email": "junaidbasit350@gmail.com", "name": "Janice Doe" }];
    // sendSmtpEmail.bcc = [{ "email": "John Doe", "name": "example@example.com" }];
    sendSmtpEmail.replyTo = { "email": "info@paasa.org.au", "name": "Passa Team" };
    // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = sendEmailData?.params;
    sendSmtpEmail.templateId = sendEmailData?.templateId;
    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email Sent");
    } catch (error) {
        console.log("Email send failed");
    }
};

const sendEmailOnRegistration = (user: User, profile: Profile | null) => {
    if (!_.isEmpty(user) && !_.isEmpty(user?.email) && !_.isEmpty(user?.userRole)) {
        const sendEmailData = {
            to: [{
                email: user?.email
            }],
            templateId: 4,
            params: {
                "FIRSTNAME": profile?.firstName ?? "",
                "LASTNAME": profile?.lastName ?? "",
                "USERROLE": user?.userRole?.toLowerCase(),
                // "EMAILVERIFICATION": user?.emailVerification
            }
        };
        sendEmail(sendEmailData);
    };
};

const sendEmailForVerification = (email: string, emailVerification: string) => {
    if (!_.isEmpty(email) && !_.isEmpty(emailVerification)) {
        const sendEmailData = {
            to: [{
                email: email
            }],
            templateId: 12,
            params: {
                "EMAILVERIFICATION": emailVerification
            }
        };
        sendEmail(sendEmailData);
    };
};

const sendEmailOnContactUs = (email: string, name: string, message: string,) => {
    if (!_.isEmpty(email) && !_.isEmpty(message)) {
        const sendEmailData = {
            to: [{
                email: "info@paasa.org.au"
            }],
            templateId: 14,
            params: {
                'FULLNAME': name,
                'MESSAGE': message,
                'EMAIL': email
            }
        };
        sendEmail(sendEmailData);
    };
};

const sendEmailOnBooking = (user: User, profile: Profile | null, booking: VehicleBooking, vehicle: Vehicle) => {
    if (!_.isEmpty(user) && !_.isEmpty(user?.email) && !_.isEmpty(booking)) {
        const sendEmailData = {
            to: [{
                email: user?.email
            }],
            templateId: 7,
            params: {
                "FIRSTNAME": profile?.firstName ?? "",
                "LASTNAME": profile?.lastName ?? "",
                "STARTDATE": booking?.startDate ? moment(booking?.startDate).format("DD-MM-YYYY") : "",
                "ENDDATE": booking?.endDate ? moment(booking?.endDate).format("DD-MM-YYYY") : "",
                "VEHICLENAME": vehicle?.name ?? ""
            }
        };
        sendEmail(sendEmailData);
    }
};
const sendEmailOnBookingApprovalOrRejection = (user: User, profile: Profile | null, booking: VehicleBooking, vehicle: Vehicle) => {

    if (!_.isEmpty(user) && !_.isEmpty(user?.email) && !_.isEmpty(booking)) {
        const sendEmailData = {
            to: [{
                email: user?.email
            }],
            templateId: 9,
            params: {
                "FIRSTNAME": profile?.firstName ?? "",
                "LASTNAME": profile?.lastName ?? "",
                "STARTDATE": booking?.startDate ?? "",
                "ENDDATE": booking?.endDate ?? "",
                "VEHICLENAME": vehicle?.name ?? "",
                "BOOKINGSTATUS": booking?.approvedStatus?.toLowerCase()
            }
        };
        sendEmail(sendEmailData);
    }
};

const sendEmailOnVechileIssue = (user: User, profile: Profile | null, booking: VehicleBooking, vehicle: Vehicle) => {
    if (!_.isEmpty(user) && !_.isEmpty(user?.email) && !_.isEmpty(booking)) {
        const sendEmailData = {
            to: [{
                email: user?.email
            }],
            templateId: 10,
            params: {
                "FIRSTNAME": profile?.firstName ?? "",
                "LASTNAME": profile?.lastName ?? "",
                "STARTDATE": booking?.startDate ?? "",
                "ENDDATE": booking?.endDate ?? "",
                "VEHICLENAME": vehicle?.name ?? ""
            }
        };
        sendEmail(sendEmailData);
    }
};

const sendEmailOnVechileReturn = async (user: User, profile: Profile | null, vehicle: Vehicle, returnVechile: ReturnVechicle) => {
    const payload = {
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        vehicleName: vehicle?.name ?? "",
        recipt: returnVechile?.receipt ?? []
    }
    const htmlContent = createReturnVechileContent(payload);
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, appConfig.sendinblueApiKey);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.htmlContent = `<!DOCTYPE html> <html> <body>${htmlContent}</body></html>`;

    sendSmtpEmail.subject = "Vehicle Return";
    sendSmtpEmail.sender = { "name": "Passa Support", "email": "info@paasa.org.au" };
    sendSmtpEmail.to = [{ email: user?.email }];
    sendSmtpEmail.replyTo = { "email": "info@paasa.org.au", "name": "Passa Team" };
    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email Sent");
    } catch (error) {
        console.log("JSON", JSON.stringify(error));

        console.log("Email send failed");
    }
}
const createReturnVechileContent = (payload: any) => {
    const recipt = payload?.recipt ?? [];
    let completeEmailContent = "";
    const first = `
<span style="color: rgb(0, 0, 0); font-size: medium;"><span style="font-size: 14px;">Dear ${payload?.firstName ?? ""} ${payload?.lastName ?? ""}:</span></span><br/>
<span style="color: rgb(0, 0, 0); font-family: roboto, sans-serif; font-size: medium; white-space: pre-wrap; background-color: rgb(248, 248, 248);">Thank You for return </span>
<span style="color: rgb(0, 0, 0); font-size: medium;">vehicle.</span><br/>
<span style="color: rgb(0, 0, 0); font-size: medium;">You have return vehicle&nbsp;</span><span style="color: rgb(0, 0, 0); font-size: medium;">${payload?.vehicleName}.<br />
Payment summary given Bellow:</span><br />
<br/>`;

    let chargesContent = "";
    for (const single of recipt) {
        if (single?.value) {
            const firstLine = `<div style="margin-left: 40px;">
            <span style="font-size:12px;">${single?.finalValue ? "" : "Total "}${single?.source}:&nbsp; &nbsp; &nbsp; &nbsp;$${single?.value}<br/>`;
            let finalString = "";
            if (single?.adjustment > 0) {
                finalString = `${firstLine} &nbsp; &nbsp; Additional:&nbsp; &nbsp; &nbsp; &nbsp;$${single?.adjustment}<br/>
                    Total ${single?.source}:  $${single?.finalValue} </span><br/> </div>`
            } else if (single?.adjustment < 0) {
                finalString = `${firstLine} &nbsp; &nbsp; Discount:&nbsp; &nbsp; &nbsp; &nbsp;-$${Math.abs(single?.adjustment)}<br/>
                    Total ${single?.source}:  $${single?.finalValue} </span><br/></div>`
            } else {
                finalString = firstLine.concat(`</span></div>`);
            }
            chargesContent = chargesContent.concat(finalString);
        }
    }
    completeEmailContent = first.concat(chargesContent);

    return completeEmailContent;
}



export default {
    testConnection,
    sendEmail,
    sendEmailOnBooking,
    sendEmailOnRegistration,
    sendEmailOnBookingApprovalOrRejection,
    sendEmailOnVechileIssue,
    sendEmailOnVechileReturn,
    sendEmailOnContactUs,
    sendEmailForVerification
}