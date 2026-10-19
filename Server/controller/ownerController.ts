import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { error } from "console";
import { Restaurant } from "../models/Restaurant.js";


// Get owner's Restaurant
// GET /api/owner/restaurnat
export const getOwnerRestaurant = async (req: AuthRequest, res: Response): Promise<void> =>  {
    try{
        const restaurant = await Restaurant.findOne({owner: req.user?._id});

        if(!restaurant){
            res.status(200).json(null);
            return;
        }

        res.json(restaurant);

    }catch(error: any){
        console.error(error);
        res.status(400).json({message: error.message});
        return;
    }
}

// Create owner's restaurant (submitted to pending)
// POST /api/owner/restaurant
export const createOwnerRestaurant = async (req: AuthRequest, res: Response): Promise<void> =>  {
    try{
        const existing = await Restaurant.findOne({owner: req.user?._id});

        if(existing){
            res.status(400).json({message: "You already have a restaurnat Registerd"});
            return;
        }

        const {name, description, cuisine, priceRange, location, address, chef, availableSlots, totalSeats, tags} = req.body;
         
        if(!name || !description || !cuisine || !priceRange ||!location || !address || !chef){
            res.status(400).json({ message: "Provide all the required Field"})
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "-");

        if(slug){
            res.status(400).json({message: "Restaurant Already Exist with this Name"})
        }
    }catch(error: any){
        console.error(error);
        res.status(400).json({ message: error.message});
        return;
    }
}

// Update Owner's Restaurant
// PUT /api/owner/restaurant
export const updateOwnerRestaurant = async (req: AuthRequest, res: Response): Promise<void> =>  {
    try{

    }catch(error: any){
        console.error(error);
        res.status(400).json({ message: error.message});
        return;
    }
}

// Get bookings for owner's Restaurant
// GET /api/owner/bookings
export const getOwnerBookings = async (req: AuthRequest, res: Response): Promise<void> =>  {
    try{

    }catch(error: any){
        console.error(error);
        res.status(400).json({ message: error.message});
        return;
    }
}

// Update Status of booking
// PUT /api/owner/restaurant/:id/status
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> =>  {
    try{

    }catch(error: any){
        console.error(error);
        res.status(400).json({ message: error.message});
        return;
    }
}