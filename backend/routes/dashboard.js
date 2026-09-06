const express = require("express");
const router = express.Router();

const Employee = require("../models/Employee");
const User = require("../models/User");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const adminOrHr = require("../middleware/adminOrHr");
const EmployeeRequest = require("../models/EmployeeRequest");
//const ProfileRequest = require("../models/ProfileRequest");
const ApplicationRequest = require("../models/ApplicationRequest");
router.get("/stats", auth, adminOrHr, async (req, res) => {

    try {

        const [
            employees,
            systemAdmins,
            employeeAdmins,
            hr,
            pending,
            departments,
            pendingRequests,
            pendingApplications

        ] = await Promise.all([

            // ONLY ACTIVE EMPLOYEES
            Employee.find({
                isActive: { $ne: false }
            }),

            // First Admin stored in User collection
            User.find(),

            // Other Admins stored in Employee collection
            Employee.find({
                role: "Admin",
                isActive: { $ne: false }
            }),

            // HR
            Employee.find({
                role: "HR",
                isActive: { $ne: false }
            }),

            // First login pending
            Employee.find({
                firstLogin: true,
                isActive: { $ne: false }
            }),

            // Departments of active employees
            Employee.aggregate([
                {
                    $match: {
                        isActive: { $ne: false }
                    }
                },
                {
                    $group: {
                        _id: "$department",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Pending profile requests
            EmployeeRequest.countDocuments({
                status: "Pending"
            }),

            // Pending applications
            ApplicationRequest.countDocuments({
                status: "Pending"
            })

        ]);


        res.json({

            // ONLY ACTIVE EMPLOYEES
            totalEmployees: employees.length,

            totalAdmins:
                systemAdmins.length +
                employeeAdmins.length,

            // Active HR count
            totalHR: hr.length,

            // Active departments
            totalDepartments:
                departments.length,

            // Active employees with first login pending
            firstLoginPending:
                pending.length,

            totalRoles: 3,

            employees,

            admins: [
                ...systemAdmins,
                ...employeeAdmins
            ],

            hr,

            pending,

            departments,

            pendingRequests,

            pendingApplications,

            totalPendingRequests:
                pendingRequests +
                pendingApplications

        });

    }

    catch (err) {

        console.log(
            "DASHBOARD STATS ERROR:",
            err
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

});
router.get(
    "/recent",
    auth,
    adminOrHr,
    async (req, res) => {

        try {

            const employees =
                await Employee.find({
                    isActive: { $ne: false }
                })
                .sort({
                    createdAt: -1
                })
                .limit(10);

            res.status(200).json(employees);

        }

        catch (err) {

            console.log(
                "RECENT EMPLOYEES ERROR:",
                err
            );

            res.status(500).json({
                message: "Server Error"
            });

        }

    }
);

module.exports = router;