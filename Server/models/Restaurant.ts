import { Types } from "mongoose";
import { Document, model, Schema } from "mongoose";

export interface IRestaurant extends Document {
    owner: Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    cuisine: string;
    priceRange: "$" | "$$" | "$$$" | "$$$$";
    rating: number;
    image: string;
    reviewCount: number;
    location: string;
    address: string;
    chefName: string;
    tags: string[];
    availableSlots: string[];
    featured: boolean;
    exclusive: boolean;
    status: "pending" | "approved" | "rejected";
    totalSeats: number;
    createdAt: Date;
    updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    cuisine: { type: String, required: true, trim: true },
    priceRange: { type: String, enum: ["$", "$$", "$$$", "$$$$"], required: true },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    location: { type: String, required: true },
    image: { type: String, default: "" },
    chefName: { type: String, required: true },
    tags: [{ type: String }],
    availableSlots: [{ type: String }],
    featured: { type: Boolean, default: false },
    exclusive: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    totalSeats: { type: Number, default: 20 },
}, { timestamps: true });


export const Restaurant = model<IRestaurant>("Restaurant", RestaurantSchema);



