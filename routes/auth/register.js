import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../../db/Models.js";
import { mailOptions, transporter } from "../others/mail.js";

const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
    const userData = req.body;
    // console.log(userData);
    try {
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: userData.email  });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }else {
        const id = Date.now().toString();
        // Hash the password
        bcrypt.hash(userData.password, 10, async (err, hash) => {
            // Store hash in your password DB.
            if (err) {
              res.status(500).send({ msg: "Please enter a proper password" });
            } else {
              const newUser = await new userModel({
                ...userData,
                password: hash,
                id,
                isVerfied: false,
                });
                     
              await newUser.save(); // validates and inserts the record
              const verificationToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

              await transporter.sendMail({
                ...mailOptions,
                to:userData.email,
                subject: "Verify your email",
                html: `<p>To verify your email, please click the following link:</p>
                          <a href="${process.env.CLIENT_URL}/verify/${verificationToken}">Verify email</a>`,

              });
              res.send({ msg: "User saved successfully. Please verify your email." });
            } 
        });
      }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error. Please try again later." });
    }
});

registerRouter.post("/verify", async (req, res) => {
    const { token } = req.body;

    try {
        // console.log("JWT Secret:", process.env.JWT_SECRET);
        // console.log("Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Data:", decoded);

        const user = await userModel.findOne({ id: decoded.id });

        if (!user) {
            return res.status(400).send({ msg: "Invalid token or user doesn't exist", code: -1 });
        }

        await userModel.updateOne(
            { id: decoded.id },
            { $set: { isVerified: true } }
        );

        res.send({ msg: "User verified successfully", code: 1 });
    } catch (err) {
        console.error("Verification Error:", err.message);
        res.status(403).send({ msg: "Failed User Verification", code: -1 });
    }
});

export default registerRouter;
