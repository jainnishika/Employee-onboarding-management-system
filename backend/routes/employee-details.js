const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const adminOrHr = require("../middleware/adminOrHr");

router.get("/profile/:username", auth, async (req, res) => {
    try {
        const employee = await Employee.findOne({
            username: req.params.username
        });

        if (!employee) {
            return res.status(404).json({
            message: "Employee not found"
            });
        }

        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

// Get Employee By ID
router.get("/:id", auth, adminOrHr,async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }
        res.status(200).json(employee);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports = router;