const mongoose = require("mongoose");

const ApplicationRequestSchema = new mongoose.Schema({

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    username: {
        type: String,
        required: true
    },

    applicationType: {
        type: String,
        enum: [
            "Leave",
            "Resignation",
            "Work From Home",
            "Reimbursement"
        ],
        required: true
    },

    applicationData: {

        leaveType: {
            type: String,
            default: ""
        },

        fromDate: Date,

        toDate: Date,

        lastWorkingDay: Date,

        amount: Number,

        reason: {
            type: String,
            default: ""
        }

    },

    documents: {

        applicationLetter: {
            type: String,
            default: ""
        }

    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },

    remarks: {
        type: String,
        default: ""
    },

    submittedAt: {
        type: Date,
        default: Date.now
    },

    reviewedBy: {
        type: String,
        default: ""
    },

    reviewedAt: {
        type: Date},

},
{
timestamps: true});

module.exports = mongoose.model(
    "ApplicationRequest",
    ApplicationRequestSchema
);