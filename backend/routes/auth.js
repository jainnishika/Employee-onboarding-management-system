const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        let user = await User.findOne({ username });

        let role = "";


        // =====================================================
        // ADMIN
        // =====================================================

        if (user) {

            role = "Admin";

        }


        // =====================================================
        // EMPLOYEE / HR
        // =====================================================

        else {

            user = await Employee.findOne({ username });

            if (user) {

                role = user.role;

            }

        }


        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (!user) {

            return res.status(401).json({
                message: "Invalid Username"
            });

        }


        // =====================================================
        // CHECK ACTIVE STATUS
        // Only deactivate when explicitly false
        // =====================================================

        if (user.isActive === false) {

            return res.status(403).json({
                message: "Your account has been deactivated"
            });

        }


        // =====================================================
        // CHECK PASSWORD
        // =====================================================

        const match = await bcrypt.compare(
            password,
            user.password
        );


        if (!match) {

            return res.status(401).json({
                message: "Invalid Password"
            });

        }


        // =====================================================
        // CREATE JWT
        // =====================================================

        const token = jwt.sign(

            {
                id: user._id,

                username: user.username,

                role: role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // =====================================================
        // LOGIN SUCCESS
        // =====================================================

        res.status(200).json({

            message: "Login Successful",

            token,

            username: user.username,

            role: role,

            firstLogin: user.firstLogin

        });


    }

    catch (err) {

        console.log(
            "LOGIN ERROR:",
            err
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

});
    
router.post("/update-password", async (req, res) => {
    try {
        const {
            username,
            currentPassword,
            newPassword
        } = req.body;
        let user = await User.findOne({ username });

        if (!user) {
            user = await Employee.findOne({ username });
        }

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        const match = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!match) {
            return res.status(400).json({
                message: "Current Password Incorrect"
            });
        }
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );
        user.password = hashedPassword;
        user.firstLogin = false;
        user.passwordChangedAt = new Date();
        await user.save();
        res.status(200).json({
            message: "Password Updated Successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.post("/verify-user", async (req, res) => {
    try {
        const { username, email } = req.body;
        let user = await User.findOne({ username, email });
        if (!user) {
            user = await Employee.findOne({ username, email });
        }
        if (!user) {
            return res.status(404).json({
                message: "Invalid Username or Email"
            });
        }

        res.json({
            message: "User Verified"
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }

});
router.post("/reset-password", async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (!user) {
            user = await Employee.findOne({ username });
        }

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.firstLogin = false;
        user.passwordChangedAt = new Date();
        await user.save();

        res.json({
            message: "Password Updated Successfully"
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
module.exports = router;