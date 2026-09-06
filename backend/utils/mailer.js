const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify((error,success) => {
    if (error){
        console.log(" GMAIL SMTP ERROR");
        console.log(error);  
    }
    else{
        console.log("Gmail SMTP connection successful");
    }
});
async function sendEmployeeCredentials(
    employeeEmail,
    employeeName,
    username,
    password
){
    
 const mailOptions = {

        from: `"Employee Management System" <${process.env.SMTP_USER}>`,

        to: employeeEmail,

        subject: "Your Employee Account Has Been Created",

        html: `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
        ">
            <h2 style="color:#005aab;">
                Welcome to Employee Management System
            </h2>
            <p>
                Dear <strong>${employeeName}</strong>,
            </p>
            <p>
                Your employee account has been successfully created.
            </p>
            <p>
                Below are your login credentials:
            </p>
            <div style="
                background:#f4f7fb;
                padding:20px;
                border-radius:8px;
                margin:20px 0;
            ">
                <p>
                    <strong>Username:</strong>
                    ${username}
                </p>
                <p>
                    <strong>Temporary Password:</strong>
                    ${password}
                </p>
            </div>
            <p>
                Please login and change your password
                when prompted.
            </p>
            <p>
                For security reasons, please do not share
                your credentials with anyone.
            </p>
            <br>
            <p>
                Regards,<br>
                <strong>HR Team</strong>
            </p>
        </div>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);

    return info;
}


module.exports = {
    sendEmployeeCredentials
};