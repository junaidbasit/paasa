export default {
    validateEmail(email: string) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            return true;
        } else {
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
    }
}