import mongoose from 'mongoose';

const connectDB = async () => { 
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });
    await mongoose.connect(process.env.MONGODB_URI!, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 10000,
    });
}

export default connectDB;