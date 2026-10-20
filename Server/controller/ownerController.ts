import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import {v2 as cloudinary} from 'cloudinary'


// Helper function to upload buffer to cloudinary
const uploadToCloudinary = (fileBuffer: Buffer): Promise<{secure_url: string}> => {
    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream({folder: "QuickDine"}, (error, result)=>{
            if(error) return reject(error);
            if(!result) return reject(new Error("Upload failed"));
            resolve({secure_url: result.secure_url})
        })
        stream.end(fileBuffer);
    })
}

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

        const {name, description, cuisine, priceRange, location, address, chefName, availableSlots, totalSeats, tags} = req.body;
         
        if(!name || !description || !cuisine || !priceRange ||!location || !address || !chefName){
            res.status(400).json({ message: "Provide all the required Field"})
            return;
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "-");

        const slugExists = await Restaurant.findOne({slug})

        if(slugExists){
            res.status(400).json({message: "Restaurant Already Exist with this Name"})
            return;
        }

        // Handle Image
        let imageUrl = "";
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;

        }

        // SetUp parsed tags and Slots
        const parsedTags = typeof tags === "string" ? tags.split(",").map( (t) =>  t.trim() ): tags || [];

        const parsedSlots = typeof availableSlots === "string" ? availableSlots.split(",").map( (t) =>  t.trim() ): availableSlots || ["17:00","18:00","19:00","20:00","21:00"];

        const restaurant = await Restaurant.create({
            name,
            slug,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chefName,
            image: imageUrl,
            tags: parsedTags,
            availableSlots: parsedSlots,
            totalSeats: totalSeats ? Number(totalSeats) : 20,
            owner: req.user?._id,
            status: "pending"
        })  

        res.status(201).json(restaurant);

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