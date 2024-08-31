import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
    },
});

const mailOptions = {
    from: process.env.MAIL_ID,
    to: ['recipient_email'],
    subject: 'Password Reset',
    text: 'sending password reset',
};

export {transporter, mailOptions}