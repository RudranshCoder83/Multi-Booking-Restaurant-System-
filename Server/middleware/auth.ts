import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export interface AuthRequest extends Request{
    user?: IUser
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get Token From Header
            token = req.headers.authorization.split(" ")[1];

            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

            // Get user from token, Exclude password
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                console.warn(`[Auth:protect] Token verified, but user not found in DB (ID: ${decoded.id})`);
                res.status(401).json({ message: "Not Authorized, User not found" });
                return;
            }
            req.user = user;
            console.log(`[Auth:protect] Authenticated: ${user.email} (Role: ${user.role}) for ${req.method} ${req.originalUrl}`);
            next();
            return;
        } catch (error) {
            console.error("[Auth:protect] Token verification error:", error);
            res.status(401).json({ message: "Not Authorized, Token failed" });
            return;
        }
    }

    if (!token) {
        console.warn(`[Auth:protect] No token provided for ${req.method} ${req.originalUrl}`);
        res.status(401).json({ message: "No token Found" });
        return;
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === "admin") {
        console.log(`[Auth:adminOnly] Admin check passed for ${req.user.email}`);
        next();
    } else {
        console.warn(`[Auth:adminOnly] Access denied for ${req.user?.email || "anonymous"} (Role: ${req.user?.role || "none"})`);
        res.status(403).json({ message: "Access Denied, Admin Role Required" });
        return;
    }
};

export const ownerOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && (req.user.role === "owner" || req.user.role === "admin")) {
        console.log(`[Auth:ownerOnly] Owner/Admin check passed for ${req.user.email} (Role: ${req.user.role})`);
        next();
    } else {
        console.warn(`[Auth:ownerOnly] Access denied for ${req.user?.email || "anonymous"} (Role: ${req.user?.role || "none"})`);
        res.status(403).json({ message: "Access Denied, Owner or Admin Role Required" });
        return;
    }
};