export default {
    secret: "sdlfjlsdjkflsdjfsdjflsdjf",
    terminal_id: '39493843',
    transaction_key: 'asdfsldkfjdslkfjsdl',
    authConfig: {
        jwt_secret: process.env.JWT_SECRET || 'jwtSecret@paasa',
        jwt_expiresin: process.env.JWT_EXPIRES_IN || '1d',
        jwt_reset_password_rxpire: process.env.JWT_RESET_PASSWORD_EXPIRES_IN || "5m",
        saltRounds: parseInt(process.env.JWT_SALT_ROUND ?? "10"),
        refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET || '',
        refresh_token_expiresin:
            process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '2d' // 2 days
    },
    superAdminUser: {
        email: process.env.SUPER_ADMIN_EMAIL || 'superAdmi@gmail.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'superAdmin@123'
    }
};