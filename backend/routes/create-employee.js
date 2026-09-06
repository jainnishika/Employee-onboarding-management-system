const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const adminOrHr = require("../middleware/adminOrHr");
const upload = require("../middleware/upload");
const {sendEmployeeCredentials} = require("../utils/mailer");
router.post("/", auth, adminOrHr,upload.any(), async (req, res) => {
    try {
        let previousServices = [];

if (req.body.previousServices) {

    previousServices =
        JSON.parse(req.body.previousServices);

}
const files = req.files || [];

const getFileName = (fieldName) => {

    const file = files.find(
        file => file.fieldname === fieldName
    );

    return file ? file.filename : "";

};
previousServices = previousServices.map(
    (service, index) => {

        return {

            ...service,

            experienceCertificate:
                getFileName(
                    `experienceCertificate_${index}`
                )

        };

    }
);
        const {
            name,
            dob,
            age,
            email,
            phone,
            gender,
            department,
            designation,
            joiningDate,
            address,
            role
        } = req.body;
        const emailExist = await Employee.findOne({ email });

        if (emailExist) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        let username = name.trim().split(" ")[0].toLowerCase();
        let originalUsername = username;
        let count = 1;
        while (await Employee.findOne({ username })) {
            username = originalUsername + count;
            count++;
        }
        // Default Password
        const defaultPassword = username + "@123";

        // Encrypt Password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Save Employee
        const employee = new Employee({

    name,
    dob,
    age,
    email,
    phone,
    gender,
    department,
    designation,
    joiningDate,
    address,
    role,
    username,
    password: hashedPassword,
    firstLogin: true,

   additionalDetails: {

    emergencyContactName: "",
    emergencyContactNumber: "",
    bloodGroup: "",
    maritalStatus: "Single",
    spouseName: "",
    spouseOccupation: "",
    nomineeName: "",
    relationship: "",
    nomineePhone: "",
    transportFacility: "No",
    hra: "No",
    aadhaar: "",
    pan: "",

    previousServices: previousServices

},

documents: {
    profilePhoto:
        getFileName("profilePhoto"),
    aadhaar:
        getFileName("aadhaar"),
    pan:
        getFileName("pan"),
    resume:
        getFileName("resume"),
    licence:
        getFileName("licence"),
    rc:
        getFileName("rc"),
    vehicle:
        getFileName("vehicle")
}
});
        await employee.save();


// Send login credentials to employee

try {
    await sendEmployeeCredentials(
        email,
        name,
        username,
        defaultPassword
    );
    console.log(
        "Credentials email sent to:",
        email
    );
} catch (emailError) {

    console.log(
        "Email sending failed:",
        emailError
    );

}

res.status(201).json({
    message: "Employee Created Successfully",
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
router.get("/", auth, adminOrHr, async (req, res) => {

    console.log("API Called");
console.log(req.query);

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortBy = req.query.sortBy || "name";
        const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
        const search = req.query.search || "";
        const department = req.query.department || "";
        const role = req.query.role || "";
        const designation = req.query.designation || "";

        const filter = {
            isActive: { $ne: false }
        };

        if (search) {

            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    username: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    department: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }
        if (department) {
            filter.department = department;
        }
        if (role) {
            filter.role = role;
        }
        if (designation) {
            filter.designation = designation;
        }
        const totalEmployees =
            await Employee.countDocuments(filter);
        const employees =
        await Employee.find(filter)
        .sort({
            [sortBy]: sortOrder
        })
        .skip((page - 1) * limit)
        .limit(limit);
        res.status(200).json({
            employees,
            totalEmployees,
            currentPage: page,
            totalPages: Math.ceil(totalEmployees / limit)
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});

router.delete("/:id", auth, admin, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }
        res.status(200).json({
            message: "Employee Deleted Successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });

    }

});

router.put(
    "/deactivate/:id",
    auth,
    admin,
    async (req, res) => {

        try {

            console.log(
                "DEACTIVATE ID:",
                req.params.id
            );

            const employee =
                await Employee.findById(req.params.id);

            console.log(
                "EMPLOYEE FOUND:",
                employee
            );

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

            employee.isActive = false;

            await employee.save();

            console.log(
                "AFTER DEACTIVATE:",
                employee.isActive
            );

            return res.status(200).json({

                message:
                    "Employee Deactivated Successfully",

                employee

            });

        }

        catch (err) {

            console.log(
                "DEACTIVATE ERROR:",
                err
            );

            return res.status(500).json({
                message: "Server Error"
            });

        }

    }
);
router.put("/activate/:id", auth, admin, async (req, res) => {

    try {

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        employee.isActive = true;

        await employee.save();

        res.status(200).json({
            message: "Employee Activated Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
router.get(
    "/inactive",
    auth,
    adminOrHr,
    async (req, res) => {

        try {

            const {
                page = 1,
                limit = 10,
                search = "",
                department = "",
                role = "",
                designation = "",
                sortBy = "name",
                sortOrder = "asc"
            } = req.query;


            // =====================================
            // FILTER
            // =====================================

            const filter = {
                isActive: false
            };


            // =====================================
            // SEARCH
            // =====================================

            if (search.trim() !== "") {

                filter.$or = [

                    {
                        name: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        username: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        email: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        department: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        designation: {
                            $regex: search,
                            $options: "i"
                        }
                    }

                ];

            }


            // =====================================
            // DROPDOWN FILTERS
            // =====================================

            if (department) {

                filter.department = department;

            }

            if (role) {

                filter.role = role;

            }

            if (designation) {

                filter.designation = designation;

            }


            // =====================================
            // SORT
            // =====================================

            const allowedSortFields = [

                "name",
                "username",
                "email",
                "department",
                "designation",
                "role",
                "updatedAt"

            ];

            const finalSortBy =
                allowedSortFields.includes(sortBy)
                    ? sortBy
                    : "name";


            const finalSortOrder =
                sortOrder === "desc"
                    ? -1
                    : 1;


            // =====================================
            // PAGINATION
            // =====================================

            const pageNumber =
                Math.max(Number(page), 1);

            const pageLimit =
                Math.max(Number(limit), 1);

            const skip =
                (pageNumber - 1) * pageLimit;


            const total =
                await Employee.countDocuments(filter);


            const employees =
                await Employee.find(filter)
                    .sort({
                        [finalSortBy]:
                            finalSortOrder
                    })
                    .skip(skip)
                    .limit(pageLimit);


            const totalPages =
                Math.ceil(
                    total / pageLimit
                );


            // =====================================
            // RESPONSE
            // =====================================

            res.status(200).json({
                employees,
                currentPage:
                    pageNumber,
                totalPages,
                total
            });
        }

        catch (err) {

            console.log(
                "INACTIVE EMPLOYEES ERROR:",
                err
            );

            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);
router.get("/profile/:username", auth, async (req, res) => {

    try {

        if (
            req.user.role !== "Admin" &&
            req.user.username !== req.params.username
        ) {
            return res.status(403).json({
                message: "Access Denied"
            });
        }

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
module.exports = router;