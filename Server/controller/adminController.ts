import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import { User } from "../models/User.js";
import { Booking } from "../models/Booking.js";

// Get all restaurant for admin management
// GET /api/admin/restaurant
export const getAllRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const restaurant = await Restaurant.find({}).populate("owner", "name email phone").sort({ createdAt: -1 });

        res.json(restaurant);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

// Approve/Reject a restaurant profile
// PUT /api/admin/restaurant/:id/approve
export const approveRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!status || !["approved", "rejected", "pending"].includes(status)) {
            res.status(400).json({ message: "Please Provide a valid approval status" });
            return;
        }

        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            res.status(400).json({ message: "Restaurant not found" });
            return;
        }

        restaurant.status = status;
        await restaurant.save();

        res.json(restaurant);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

// Get system Statistics
// PUT /api/admin/stats
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalOwners = await User.countDocuments({ role: "owner" });
        const totalBookings = await Booking.countDocuments({});
        const totalRestaurant = await Restaurant.countDocuments({});

        const latestBookings = await Booking.find({}).populate("user", "name email").populate("restaurant", "name").sort({ createdAt: -1 }).limit(10);

        res.json({
            users: {
                totalOwners,
                totalUsers,
                total: totalOwners + totalUsers,
            },
            restaurants: {
                total: totalRestaurant,
            },
            bookings: {
                total: totalBookings,
            },
            latestBookings,
        })
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
} 