import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - token error" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
        return res.status(401).json({ message: "Unauthorized - User Not Found" });
    }

    req.user = user;
    next();
    } catch (error) {
    console.log("Error in ProtectRoute", error);
    return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }
};