import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../../db/Models.js";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const userData = req.body; // email, password
  try {
    // Check if the user exists
    const userObj = await userModel.findOne({ email: userData.email });
    if (userObj) {
        // Login to handle successful login
        // verify the password send success message only if the password is correct
    // console.log(userData.password, userObj.password)
        bcrypt.compare( userData.password, userObj.password, async function (err, result) {
            // result == true
            if (err) {
              res.status(500).send({ msg: "Something went wrong"  });
            }else {
              if (result) {
                const user = {
                    email: userObj.email,
                    name: userObj.name,
                    role: userObj.role, // Add other user details as needed
                  };

                  var token = jwt.sign(user, process.env.JWT_SECRET, {
                    expiresIn: "1day",
                  });
                  res.status(200).send({
                  msg: "User Successfully Logged in",
                  code: 1,
                  token,
                });
            }else {
                res.status(400).send({ msg: "User Credentials Failed", code: 0 });
              }
            }
       });
    }
}  catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ msg: "Something went wrong" });
}
});

export default loginRouter;


