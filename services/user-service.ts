import bcrypt from "bcryptjs";

const hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const createUser = async (user: any) => {
    // hash password
    if (user?.password) {
        user.password = hashPassword(user.password);
    }
    return this.User.create(this.createUser(user));
};

export {


}