const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const adminOrHr = require("../middleware/adminOrHr");
const upload =
    require("../middleware/upload");
// Get employee by ID
router.get("/:id",auth,adminOrHr, async (req, res) => {

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
// Update employee
router.put(
    "/:id",
    auth,
    adminOrHr,
    upload.any(),
    async (req, res) => {

        try {

            const employee =
                await Employee.findById(req.params.id);

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }


            // =====================================
            // BASIC EMPLOYEE DETAILS
            // =====================================

            employee.name =
                req.body.name;

            employee.dob =
                req.body.dob;

            employee.age =
                Number(req.body.age);

            employee.email =
                req.body.email;

            employee.phone =
                req.body.phone;

            employee.gender =
                req.body.gender;

            employee.department =
                req.body.department;

            employee.designation =
                req.body.designation;

            employee.joiningDate =
                req.body.joiningDate;

            employee.address =
                req.body.address;

            employee.role =
                req.body.role;


            // =====================================
            // ADDITIONAL DETAILS
            // =====================================

            if (req.body.additionalDetails) {

                const additionalDetails =
                    JSON.parse(
                        req.body.additionalDetails
                    );


                employee.additionalDetails
                    .emergencyContactName =
                    additionalDetails.emergencyContactName || "";


                employee.additionalDetails
                    .emergencyContactNumber =
                    additionalDetails.emergencyContactNumber || "";


                employee.additionalDetails
                    .bloodGroup =
                    additionalDetails.bloodGroup || "";


                employee.additionalDetails
                    .maritalStatus =
                    additionalDetails.maritalStatus || "Single";


                employee.additionalDetails
                    .spouseName =
                    additionalDetails.spouseName || "";


                employee.additionalDetails
                    .spouseOccupation =
                    additionalDetails.spouseOccupation || "";


                employee.additionalDetails
                    .nomineeName =
                    additionalDetails.nomineeName || "";


                employee.additionalDetails
                    .relationship =
                    additionalDetails.relationship || "";


                employee.additionalDetails
                    .nomineePhone =
                    additionalDetails.nomineePhone || "";


                employee.additionalDetails
                    .transportFacility =
                    additionalDetails.transportFacility || "No";


                employee.additionalDetails
                    .hra =
                    additionalDetails.hra || "No";


                employee.additionalDetails
                    .aadhaar =
                    additionalDetails.aadhaar || "";


                employee.additionalDetails
                    .pan =
                    additionalDetails.pan || "";


                // =====================================
                // PREVIOUS SERVICES
                // =====================================

                if (
                    Array.isArray(
                        additionalDetails.previousServices
                    )
                ) {

                    employee.additionalDetails
                        .previousServices =
                        additionalDetails.previousServices;

                }

            }


            // =====================================
            // FILES
            // =====================================

            const files =
                req.files || [];


            const getFileName =
                (fieldName) => {

                    const file =
                        files.find(
                            file =>
                                file.fieldname ===
                                fieldName
                        );

                    return file
                        ? file.filename
                        : null;

                };


            // =====================================
            // NORMAL DOCUMENTS
            // =====================================

            const profilePhoto =
                getFileName("profilePhoto");

            if (profilePhoto) {

                employee.documents.profilePhoto =
                    profilePhoto;

            }


            const aadhaar =
                getFileName("aadhaar");

            if (aadhaar) {

                employee.documents.aadhaar =
                    aadhaar;

            }


            const pan =
                getFileName("pan");

            if (pan) {

                employee.documents.pan =
                    pan;

            }


            const resume =
                getFileName("resume");

            if (resume) {

                employee.documents.resume =
                    resume;

            }


            const licence =
                getFileName("licence");

            if (licence) {

                employee.documents.licence =
                    licence;

            }


            const rc =
                getFileName("rc");

            if (rc) {

                employee.documents.rc =
                    rc;

            }


            const vehicle =
                getFileName("vehicle");

            if (vehicle) {

                employee.documents.vehicle =
                    vehicle;

            }


            // =====================================
            // EXPERIENCE CERTIFICATES
            // =====================================

            if (
                Array.isArray(
                    employee.additionalDetails
                        .previousServices
                )
            ) {

                employee.additionalDetails
                    .previousServices
                    .forEach(
                        (service, index) => {

                            const file =
                                getFileName(
                                    `experienceCertificate_${index}`
                                );


                            if (file) {

                                service
                                    .experienceCertificate =
                                    file;

                            }

                        }
                    );

            }


            // =====================================
            // SAVE
            // =====================================

            await employee.save();


            // =====================================
            // RESPONSE
            // =====================================

            res.status(200).json({

                message:
                    "Employee Updated Successfully",

                employee

            });

        }

        catch (err) {

            console.log(
                "UPDATE EMPLOYEE ERROR:",
                err
            );

            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);

module.exports = router;