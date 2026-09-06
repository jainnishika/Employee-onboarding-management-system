const express = require("express");
const router = express.Router();

const EmployeeRequest = require("../models/EmployeeRequest");
const Employee = require("../models/Employee");

const auth = require("../middleware/auth");

router.post("/submit", auth, async (req, res) => {

    try {
        const { employee } = req.body;
        // Find Employee
        const existingEmployee = await Employee.findById(employee._id);
        if (!existingEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }
        // Check if request already exists
        const pendingRequest = await EmployeeRequest.findOne({
            employeeId: existingEmployee._id,
            status: "Pending"
        });
        if (pendingRequest) {
            return res.status(400).json({
                message: "You already have a pending request."
            });
        }
        const request = new EmployeeRequest({
            employeeId: existingEmployee._id,
            username: existingEmployee.username,
            oldData: existingEmployee,
            requestedData: employee,
            status: "Pending"
        });
        await request.save();
           res.status(201).json({
            message: "Profile update request sent successfully."
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.get("/status/:username", auth, async (req, res) => {
    try {
        console.log("Username received:", req.params.username);
        const request = await EmployeeRequest.findOne({
            username: req.params.username
        }).sort({ submittedAt: -1 });
        console.log("Request Found:", request);
        if (!request) {
            return res.status(404).json({
                message: "No request found"
            });
        }
        res.json(request);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.get("/my-requests", auth, async (req, res) => {

    try {

        console.log("========== MY REQUESTS API ==========");
        console.log("Logged in user:", req.user);
        // Find logged-in employee
        const employee = await Employee.findById(req.user.id);
        console.log("Employee found:", employee);
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }
        console.log(
            "Employee ID:",
            employee._id.toString()
        );
        console.log(
            "Employee Username:",
            employee.username
        );

        // =========================
        // PAGINATION
        // =========================
        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;


        // =========================
        // SORTING
        // =========================

        const sortBy =
            req.query.sortBy || "submittedAt";

        const sortOrder =
            req.query.sortOrder === "asc"
                ? 1
                : -1;


        // =========================
        // FILTER
        // =========================

        const filter = {

            employeeId: employee._id

        };
        const status = req.query.status || "All";
        if (status !== "All") {
        filter.status = status;
        }


        console.log(
            "Request filter:",
            filter
        );


        // =========================
        // COUNT
        // =========================

        const totalRequests =
            await EmployeeRequest.countDocuments(
                filter
            );


        console.log(
            "Total requests:",
            totalRequests
        );


        // =========================
        // GET REQUESTS
        // =========================

        const requests =
            await EmployeeRequest
                .find(filter)
                .sort({
                    [sortBy]: sortOrder
                })
                .skip(skip)
                .limit(limit);


        console.log(
            "Requests found:",
            requests
        );


        // =========================
        // TOTAL PAGES
        // =========================

        const totalPages =
            Math.ceil(
                totalRequests / limit
            );


        res.status(200).json({

            requests: requests,

            totalRequests: totalRequests,

            currentPage: page,

            totalPages: totalPages

        });

    }

    catch (err) {

        console.log(
            "MY REQUESTS ERROR:",
            err
        );

        res.status(500).json({

            message: "Server Error",

            error: err.message

        });

    }

});
router.put("/approve/:id", auth, async (req, res) => {
    try { 
        const request = await EmployeeRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }
        // Update employee with requested data
        const employee = await Employee.findById(request.employeeId);

if (!employee) {
    return res.status(404).json({
        message: "Employee not found"
    });
}

// Copy all requested fields
employee.set(request.requestedData);

// Make sure previous services are copied
employee.additionalDetails.previousServices =
    request.requestedData.additionalDetails.previousServices;

// Save
await employee.save();
        // Update request status
        request.status = "Approved";
        request.reviewedBy = req.user.username;
        request.reviewedAt = new Date();
        await request.save();
        res.json({
            message: "Request Approved Successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server Error"
        });
    }
});
router.put("/reject/:id", auth, async (req, res) => {

    try {
        const { remarks } = req.body;
        const request = await EmployeeRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }
        request.status = "Rejected";
        request.remarks = remarks;
        request.reviewedBy = req.user.username;
        request.reviewedAt = new Date();
        await request.save();
        res.json({
            message: "Request Rejected Successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server Error"
        });
    }
});
router.get("/all", auth, async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const status = req.query.status || "";
        const sortBy = req.query.sortBy || "submittedAt";
        const sortOrder =
        req.query.sortOrder === "asc" ? 1 : -1;

        const filter = {
            isActive: { $ne: false }
        };

        // Search by username
        if (search) {
            filter.username = {
                $regex: search,
                $options: "i"
            };
        }

        // Status filter
        if (status && status !== "All") {
            filter.status = status;
        }

        // Count matching requests
        const totalRequests =
            await EmployeeRequest.countDocuments(filter);

        // Get requests
        const requests =
            await EmployeeRequest.find(filter)
                .sort({ [sortBy]: sortOrder})
                .skip((page - 1) * limit)
                .limit(limit)
                ;

        res.status(200).json({

            requests: requests,

            totalRequests: totalRequests,

            currentPage: page,

            totalPages: Math.ceil(totalRequests / limit)

        });

    }
    catch (err) {

        console.log("GET ALL REQUESTS ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
module.exports = router;