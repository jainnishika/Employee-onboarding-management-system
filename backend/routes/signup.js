const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/", async (req, res) => {
    try {
        const { name, dob, age, email } = req.body;
        if(!name || !dob || !age ||!email){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
        return res.status(400).json({
            message: "invalid email"
        });
    }
        const emailExist = await User.findOne({ email });

        if (emailExist) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        let username = name.trim().split(" ")[0].toLowerCase();

        let originalUsername = username;
        let count = 1;

        while (await User.findOne({ username })) {
            username = originalUsername + count;
            count++;
        }
        const defaultPassword = username + "@123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const newUser = new User({
            name,
            dob,
            age,
            email,
            username,
            password: hashedPassword,
            firstLogin: true

        });

        await newUser.save();

        res.status(201).json({

            message: "User Created Successfully",
            username,
            password: defaultPassword

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
