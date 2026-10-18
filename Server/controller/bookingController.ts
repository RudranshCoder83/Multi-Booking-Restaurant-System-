// Create a new Booking
// POST /api/bookings
// @access Private

import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> =>{
    try{

    }
    catch(error: any){
        console.error(error);
        res.status(400).json({message: error.message})
    }
}

// Get Logged in user bookings
// GET /api/bookings/my
// @access Private

export const getMyBooking = async (req: AuthRequest, res: Response): Promise<void> =>{
    try{

    }
    catch(error: any){
        console.error(error);
        res.status(400).json({message: error.message})
    }
}

// Cancel a booking 
// PUT /api/bookings/:id/cancel
// @access Private

export const CancelBooking = async (req: AuthRequest, res: Response): Promise<void> =>{
    try{

    }
    catch(error: any){
        console.error(error);
        res.status(400).json({message: error.message})
    }
}