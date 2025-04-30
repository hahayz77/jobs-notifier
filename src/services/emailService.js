// const nodemailer = require('nodemailer'); // Uncomment if sending real emails
const config = require('../config'); // Import email config

// Uncomment and configure if sending real emails
/*
const transporter = nodemailer.createTransport(config.email);

const sendDailyReportEmail = async (subject, body) => {
    const mailOptions = {
        from: config.email.auth.user,
        to: config.email.auth.user,
        subject: subject,
        text: body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
*/

// Modified sendEmail function to just log to console
const sendDailyReportEmail = async (subject, body) => {
    console.log('--- Simulating Email Send ---');
    console.log('Subject:', subject);
    console.log('Body:\n', body);
    console.log('---------------------------');
};


module.exports = {
    sendDailyReportEmail
};