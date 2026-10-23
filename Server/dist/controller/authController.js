import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};
// Register a New User
// POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Please fill all the required fields" });
            return;
        }
        // Check if user already exists
        const registerUserExists = await User.findOne({ email });
        if (registerUserExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id.toString())
            });
        }
        else {
            res.status(400).json({
                message: "Invalid User Data",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message,
        });
    }
};
// Authenticate User and Get Token
// POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Please fill all the required fields" });
            return;
        }
        // Check if user Present in Database
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: "Invalid Email Or Password" });
            return;
        }
        if (!user.password) {
            res.status(401).json({ message: "Invalid Email Or Password" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid Email Or Password" });
            return;
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id.toString())
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message,
        });
    }
};
// Get User Profile
// GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not Authorized" });
            return;
        }
        res.json(req.user);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
