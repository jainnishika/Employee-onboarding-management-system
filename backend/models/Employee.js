const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    dob: {
        type: Date,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    joiningDate: {
        type: Date,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["Admin", "HR", "Employee"],
        default: "Employee"
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    firstLogin: {
        type: Boolean,
        default: true
    },
    isActive: {
    type: Boolean,
    default: true
    },
    additionalDetails: {

    emergencyContactName: {
        type: String,
        default: ""
    },

    emergencyContactNumber: {
        type: String,
        default: ""
    },

    bloodGroup: {
        type: String,
        default: ""
    },

    maritalStatus: {
        type: String,
        default: "Single"
    },

    spouseName: {
        type: String,
        default: ""
    },

    spouseOccupation: {
        type: String,
        default: ""
    },

    nomineeName: {
        type: String,
        default: ""
    },

    relationship: {
        type: String,
        default: ""
    },

    nomineePhone: {
        type: String,
        default: ""
    },

    transportFacility: {
        type: String,
        default: "No"
    },

    hra: {
        type: String,
        default: "No"
    },
    

    aadhaar: {
        type: String,
        default: ""
    },
previousServices:[{
    organisation: String,
    fromDate: Date,
    toDate: Date,
    tenure: String,
     experienceCertificate: {
            type: String,
            default: ""
        }  
       
}]


},
    documents:{
        licence:{
         type:String,
            default:""
        },
        rc:{
         type:String,
            default:""
        },
        vehicle:{
         type:String,
            default:""
        },
        profilePhoto:{
            type:String,
            default:""
        },
        aadhaar:{
            type:String,
            default: ""
        },
        pan: {
            type:String,
            default: ""
        },
        resume: {
            type: String,
            default: ""
        },
       
         
    }

}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);