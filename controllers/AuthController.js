const User = require("../models/UserModel.js")
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')
const OTP = require("../models/OtpModel.js")
const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()

class AuthController {

    static Register = async (req, res) => {

        const { name, email, password, tc } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
            res.send({ "status": "failed", "message": "Email already exists" })

        } else {
            if (name && email && password && tc) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    const HashPassword = await bcrypt.hash(password, salt)

                    const CreateAccount = new User({
                        name: name,
                        email: email,
                        password: HashPassword,
                        tc: tc,
                    })

                    CreateAccount.save().then(async () => {

                        const Saved_user = await User.findOne({ email: email })

                        if (Saved_user) {

                            const token = JWT.sign({ UserID: Saved_user._id }, process.env.TOKEN, { expiresIn: "30d" })
                            res.send({ "status": "true", "message": "Registered successfully", "token": token })
                        } else {
                            res.send({ "status": "false", "message": "Registration Failed", })

                        }
                    })





                } catch (e) {
                    res.send({ "status": "failed", "message": "Resgistration failed", "error": e.message })

                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required" })

            }
        }
    }

    static Login = async (req, res) => {
        const { email, password } = req.body;

        // Check if the user exists with the given email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.send({ "status": "failed", "message": "User Not Exist" });
        }

        if (email && password) {
            const isHashMatch = await bcrypt.compare(password, user.password);
            if (isHashMatch) {
                // Generate a JWT token and send the user's data without the password
                const token = JWT.sign({ UserID: user._id }, process.env.TOKEN, { expiresIn: '30d' });
                const userData = { _id: user._id, name: user.name, email: user.email, tc: user.tc };

                return res.send({
                    "status": "Success",
                    "message": "Successfully logged in",
                    "token": token,
                    "data": userData
                });
            } else {
                return res.send({ "status": "failed", "message": "Incorrect password" });
            }
        } else {
            return res.send({ "status": "failed", "message": "All fields are required" });
        }
    }

    // static sendUserPasswordEmail = async (req, res) => {
    static ForgetPasswordEmail = async (req, res) => {
        const { email } = req.body;

        if (email) {
            const user = await User.findOne({ email: email })

            if (user) {
                const otp = Math.floor(1000 + Math.random() * 9000);

                // Store the OTP in the database
                const otpData = new OTP({
                    userId: user._id,
                    otpCode: otp,
                });
                await otpData.save();
                res.send({ status: 'Success', message: 'OTP sent successfully', "id": user?._id, "OTP Code": otp });
                
                // Send the OTP via email
                // const transporter = nodemailer.createTransport({
                //     service: 'Gmail', // E.g., 'Gmail', 'Yahoo', etc.
                //     auth: {
                //         user: process.env.NODEMAILERUSER,
                //         pass: process.env.NODEMAILERPASSWORD,
                //     },
                // });

                // const mailOptions = {
                //     from: process.env.NODEMAILERUSER,
                //     to: email,
                //     subject: 'Password Reset OTP',
                //     text: `Your OTP for password reset is: ${otp}`,
                // };
                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         console.error(error);
                //         res.send({ status: 'Failed', message: 'Failed to send OTP' });
                //     } else {
                //         console.log('Email sent: ' + info.response);
                //         res.send({ status: 'Success', message: 'OTP sent successfully', "id": user?._id, "OTP Code": otp });
                //     }
                // });

                // res.send({ "status": "Success", "message": "Password send succesfully", "token": token, "User_ID": user._id })
            // } else {
            //     res.send({ "status": "Failed", "message": "Email does not exist" })

            }
        // } else {
        //     res.send({ "status": "Failed", "message": "Please enter your email" })

        }
    }

    static VerifyOtp = async (req, res) => {
        const { otp, id } = req.body

        const otpData = await OTP.findOne({ userId: id, otpCode: otp });

        if (otpData) {
            res.send({ "success": true, "message": "Otp Verified successfully" })
        } else {
            res.send({ "success": false, "message": "Invalid Otp" })

        }

    }

    static resetForgetPassword = async (req, res) => {
        const { password, password_confirmation, id } = req.body;

        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({ status: 'Failed', message: 'Password does not match' });
            } else {
                // Hash the new password and update the user's password
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);

                await User.findByIdAndUpdate(id, { password: hashPassword });

                // Delete the OTP from the database since it has been used
                // await otpData?.remove();

                res.send({ status: 'Success', message: 'Password Reset Successfully' });
            }
        } else {
            res.send({ status: 'Failed', message: 'Password and confirmation are required' });
        }

    }

}


module.exports = AuthController