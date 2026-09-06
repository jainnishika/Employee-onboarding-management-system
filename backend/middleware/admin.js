const admin = (req, res, next) => {
    if (req.user.role !== "Admin" ) {
        console.log("ADMIN MIDDLEWARE USER:", req.user);
        return res.status(403).json({
            message: "Access Denied. Admin only."
        });
    }
    next();
};
module.exports = admin;