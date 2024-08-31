import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { userModel } from '../../db/Models.js';
import { mailOptions, transporter } from '../others/mail.js';


const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ msg: 'User not found', code: -1 });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
       
        await transporter.sendMail({
            ...mailOptions,
            to:user.email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
          });
        res.send({ msg: 'Reset password email sent', code: 1 });
    } catch (error) {
        res.status(500).send({ msg: 'Server error', code: -1 });
    }
});

export default forgotPasswordRouter;
