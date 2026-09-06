const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const Employee = require("../models/Employee");

router.post(
  "/documents",
  auth,
  upload.any(),
  async (req, res) => {
    try {

      const employee = await Employee.findById(req.user.id);

      if (!employee) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      // Convert req.files array into an object
      const files = {};

      req.files.forEach(file => {
        files[file.fieldname] = file;
      });

      // ---------- Normal Documents ----------

      if (files.profilePhoto) {
        employee.documents.profilePhoto = files.profilePhoto.filename;
      }

      if (files.aadhaar) {
        employee.documents.aadhaar = files.aadhaar.filename;
      }

      if (files.pan) {
        employee.documents.pan = files.pan.filename;
      }

      if (files.resume) {
        employee.documents.resume = files.resume.filename;
      }

      if (files.licence) {
        employee.documents.licence = files.licence.filename;
      }

      if (files.rc) {
        employee.documents.rc = files.rc.filename;
      }

      if (files.vehicle) {
        employee.documents.vehicle = files.vehicle.filename;
      }

      // ---------- Multiple Experience Certificates ----------

      const uploadedCertificates = {};

      req.files.forEach(file => {

        if (file.fieldname.startsWith("experienceCertificate_")) {

          uploadedCertificates[file.fieldname] = file.filename;

        }

      });

      await employee.save();

      res.json({

        message: "Documents Uploaded Successfully",

        documents: employee.documents,

        experienceCertificates: uploadedCertificates

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        message: "Server Error"

      });

    }

  }

);

module.exports = router;