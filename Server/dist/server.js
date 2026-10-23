import dotenv from "dotenv";
import express from 'express';
import cors from "cors";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import BookingRouter from "./routes/bookingRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });
const app = express();
await connectDB();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Server is Live!');
});
app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/booking", BookingRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/admin", adminRouter);
app.use((err, req, res, next) => {
    console.error("Unhandle Error: ", err);
    res.status(500).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
