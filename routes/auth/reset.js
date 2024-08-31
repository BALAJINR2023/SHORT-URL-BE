import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../../db/Models.js';


const resetPasswordRouter = express.Router();

resetPasswordRouter.post('/', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ id: decoded.id });

        if (!user) {
            return res.status(400).send({ msg: 'Invalid token or user does not exist', code: -1 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.send({ msg: 'Password reset successfully', code: 1 });
    } catch (error) {
        res.status(400).send({ msg: 'Invalid or expired token', code: -1 });
    }
});

export default resetPasswordRouter;
