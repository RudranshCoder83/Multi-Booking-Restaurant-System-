import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { CancelBooking, createBooking, getMyBooking } from "../controller/bookingController.js";

const BookingRouter = Router();

BookingRouter.post("/", protect, createBooking)
BookingRouter.get("/my", protect, getMyBooking)
BookingRouter.put("/:id/cancel", protect, CancelBooking)

export default BookingRouter;