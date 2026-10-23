import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get Token From Header
            token = req.headers.authorization.split(" ")[1];
            // Verfy Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user form token, Exclude password
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                res.status(401).json({ message: "Not Authorized, User not found" });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.error("Auth MiddleWare error", error);
            res.status(401).json({ message: "Not Authorized, Token failed" });
            return;
        }
    }
    if (!token) {
        res.status(401).json({ message: "No token Found" });
        return;
    }
};
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Acces Denied, admin Role Required" });
        return;
    }
};
export const ownerOnly = (req, res, next) => {
    if (req.user && (req.user.role === "owner" || req.user.role === "admin")) {
        next();
    }
    else {
        res.status(403).json({ message: "Acces Denied, admin Role Required" });
        return;
    }
};
