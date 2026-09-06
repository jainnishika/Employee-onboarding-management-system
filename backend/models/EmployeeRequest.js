const mongoose = require("mongoose");

const EmployeeRequestSchema = new mongoose.Schema({

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    username: {
        type: String,
        required: true
    },

    requestType: {
        type: String,
        default: "Profile Update"
    },

    oldData: {
        type: Object,
        required: true
    },

    requestedData: {
        type: Object,
        required: true
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
        type: Date
    }

});

module.exports = mongoose.model(
    "EmployeeRequest",
    EmployeeRequestSchema
);