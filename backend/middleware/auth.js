const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

    try {

        const authHeader = req.header("Authorization");

        if (!authHeader) {

            return res.status(401).json({
                message: "Access Denied"
            });

        }

        // Remove "Bearer " if it exists
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : authHeader;

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        console.log("Authenticated User:", req.user);

        next();

    } catch (err) {

        console.log("AUTH ERROR:", err);

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};

module.exports = auth;