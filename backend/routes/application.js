const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Employee = require("../models/Employee")
const ApplicationRequest =
require("../models/ApplicationRequest");
router.post("/submit", auth,async(req,res)=>{
    try{
        const employeeData = await Employee.findById(req.user.id);
  
        if (!employeeData) {
            return res.status(404).json({
                message: "Employee not found"
            });
            }
        const request = new ApplicationRequest({
            employeeId: employeeData._id,
            username: employeeData.username,
            applicationType: req.body.applicationType,
            applicationData: req.body.applicationData,
            documents:req.body.documents,
            status: "Pending"
        });
        await request.save();
        res.json({
            message: "Application submitted successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.get("/my", auth, async (req, res) => {

    try {

        // =========================
        // FIND LOGGED-IN EMPLOYEE
        // =========================

        const employee =
            await Employee.findOne({
                username: req.user.username
            });

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }


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
        // SEARCH
        // =========================

        const search =
            req.query.search || "";


        // =========================
        // STATUS
        // =========================

        const status =
            req.query.status || "All";


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
        // ALLOWED SORT FIELDS
        // =========================

        const allowedSortFields = [

            "applicationType",

            "submittedAt",

            "status"

        ];


        const safeSortBy =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "submittedAt";


        // =========================
        // BUILD FILTER
        // =========================

        const filter = {

            employeeId: employee._id

        };


        // Search application type

        if (search) {

            filter.applicationType = {

                $regex: search,

                $options: "i"

            };

        }


        // Status filter

        if (status !== "All") {

            filter.status = status;

        }


        // =========================
        // TOTAL
        // =========================

        const totalApplications =
            await ApplicationRequest
                .countDocuments(filter);


        // =========================
        // GET APPLICATIONS
        // =========================

        const applications =
            await ApplicationRequest
                .find(filter)
                .sort({
                    [safeSortBy]:
                        sortOrder
                })
                .skip(skip)
                .limit(limit);


        // =========================
        // TOTAL PAGES
        // =========================

        const totalPages =
            Math.ceil(
                totalApplications / limit
            );


        // =========================
        // RESPONSE
        // =========================

        res.status(200).json({

            applications,

            totalApplications,

            currentPage: page,

            totalPages

        });

    }

    catch (err) {

        console.log(
            "MY APPLICATIONS ERROR:",
            err
        );

        res.status(500).json({

            message: "Server Error"

        });

    }

});
router.get("/all", auth, async (req, res) => {

    try {

        // =========================
        // PAGINATION
        // =========================

        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;


        // =========================
        // SEARCH AND STATUS
        // =========================

        const search =
            req.query.search || "";

        const status =
            req.query.status || "All";


        // =========================
        // SORTING
        // =========================

        const sortBy =
            req.query.sortBy || "submittedAt";

        const sortOrder =
            req.query.sortOrder === "asc"
                ? 1
                : -1;


        console.log(
            "SORT:",
            sortBy,
            sortOrder
        );


        // =========================
        // BUILD FILTER
        // =========================

        const filter = {
            isActive: { $ne: false }
        };


        // Search employee username

        if (search) {

            filter.username = {

                $regex: search,

                $options: "i"

            };

        }


        // Status filter

        if (status !== "All") {

            filter.status = status;

        }


        // =========================
        // TOTAL RECORDS
        // =========================

        const totalApplications =
            await ApplicationRequest
                .countDocuments(filter);


        // =========================
        // PAGINATION
        // =========================

        const skip =
            (page - 1) * limit;


        // =========================
        // GET + SORT APPLICATIONS
        // =========================

        const applications =
            await ApplicationRequest
                .find(filter)
                .sort({
                    [sortBy]: sortOrder
                })
                .skip(skip)
                .limit(limit);


        // =========================
        // TOTAL PAGES
        // =========================

        const totalPages =
            Math.ceil(
                totalApplications / limit
            );


        // =========================
        // RESPONSE
        // =========================

        res.status(200).json({

            applications,

            totalApplications,

            currentPage: page,

            totalPages

        });

    }

    catch (err) {

        console.log(
            "APPLICATION PAGINATION ERROR:",
            err
        );

        res.status(500).json({

            message: "Server Error"

        });

    }

});
router.put("/approve/:id", auth, async (req, res) => {

    try {

        const application = await ApplicationRequest.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        application.status = "Approved";
        application.remarks = req.body.remarks;
        application.reviewedBy = req.user.username || "HR";
        application.reviewedAt = new Date();

        await application.save();

        res.json({
            message: "Application Approved Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
router.put("/reject/:id", auth, async (req, res) => {

    try {

        const application = await ApplicationRequest.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        application.status = "Rejected";
        application.remarks = req.body.remarks;
        application.reviewedBy = req.user.username || "HR";
        application.reviewedAt = new Date();

        await application.save();

        res.json({
            message: "Application Rejected Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
module.exports = router;