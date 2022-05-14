import userStartUp from "./user";

const runStartUp = () => {
    userStartUp.createSuperAdminUser();
};

export default {
    runStartUp
}