require('dotenv').config();

const config = {
    email: {
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    },
    port: process.env.PORT || 3000
    // Add other global configs here
};

module.exports = config;