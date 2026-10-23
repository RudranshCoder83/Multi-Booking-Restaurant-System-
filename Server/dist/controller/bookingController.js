// Create a new Booking
// POST /api/bookings
// @access Private
import { Restaurant } from "../models/Restaurant.js";
import { Booking } from "../models/Booking.js";
export const createBooking = async (req, res) => {
    try {
        const { restaurantId, date, time, guests, occasion, specialRequests } = req.body;
        if (!restaurantId || !date || !time || !guests) {
            res.status(400).json({
                message: "Please Provide all required reservation detail"
            });
            return;
        }
        const restaurant = await Restaurant.findById(restaurantId);
        // Check if restaurant exists
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }
        // Verify restaurant is approved 
        if (restaurant.status !== "approved") {
            res.status(400).json({ message: "Reservation not open for this restaurnat yet" });
            return;
        }
        const requestedGuests = Number(guests);
        const existingBookings = await Booking.find(({
            restaurnat: restaurantId,
            date: new Date(date),
            time,
            status: "confirmed"
        }));
        const bookedSeats = existingBookings.reduce((sum, b) => sum + b.guests, 0);
        const totalSeats = restaurant.totalSeats || 20;
        const availableSeats = totalSeats - bookedSeats;
        if (requestedGuests > availableSeats) {
            res.status(400).json({
                message: `Unable to reserve. Only ${availableSeats} seats are available for this time slot.`
            });
            return;
        }
        const booking = await Booking.create({
            user: req.user?._id,
            restaurant: restaurantId,
            date: new Date(date),
            time,
            guests: Number(guests),
            occasion,
            specialRequests,
            status: "confirmed"
        });
        // Populate restaurant info before Booking
        const populateBooking = await Booking.populate("restaurant", "name location image address");
        res.status(201).json(populateBooking);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
// Get Logged in user bookings
// GET /api/bookings/my
// @access Private
export const getMyBooking = async (req, res) => {
    try {
        const booking = await Booking.find({ user: req.user?._id, }).populate("restaurant", "name location image address slug").sort({ date: -1, time: -1 });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
// Cancel a booking 
// PUT /api/bookings/:id/cancel
// @access Private
export const CancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        // Verify User
        if (booking.user.toString() !== req.user?._id.toString()) {
            res.status(401).json({ message: "Not authorized to cancel this Booking" });
            return;
        }
        booking.status = "cancelled";
        await booking.save();
        const populateBooking = await Booking.populate("restaurant", "name location image address");
        res.status(201).json(populateBooking);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
