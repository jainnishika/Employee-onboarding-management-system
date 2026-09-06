const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        let folder = "";

        if (file.fieldname === "profilePhoto") {
            folder = "profile";
        }

        else if (file.fieldname === "licence") {
            folder = "licence";
        }

        else if (file.fieldname === "rc") {
            folder = "rc";
        }

        else if (file.fieldname === "vehicle") {
            folder = "vehicle";
        }

        else if (file.fieldname === "aadhaar") {
            folder = "aadhaar";
        }

        else if (file.fieldname === "pan") {
            folder = "pan";
        }

        else if (file.fieldname === "resume") {
            folder = "resume";
        }

        else if (file.fieldname === "applicationLetter") {
            folder = "application";
        }

        else if (
            file.fieldname.startsWith("experienceCertificate")
        ) {
            folder = "experienceCertificate";
        }

        else {
            return cb(
                new Error(
                    "Unsupported file field: " +
                    file.fieldname
                )
            );
        }

        const uploadPath = path.join(
            __dirname,
            "..",
            "uploads",
            folder
        );

        // Create folder if it doesn't exist

        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(uploadPath, {
                recursive: true
            });

        }

        cb(null, uploadPath);
    },


    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});


const upload = multer({
    storage
});


module.exports = upload;