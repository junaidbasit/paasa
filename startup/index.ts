import userStartUp from "./user";
// import emailService from "../services/email-service";
const runStartUp = () => {
    userStartUp.createSuperAdminUser();
    // emailService.sendEmail()
};

export default {
    runStartUp
}