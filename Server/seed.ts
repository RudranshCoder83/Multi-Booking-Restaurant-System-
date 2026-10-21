import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt" 
import { User } from "./models/User.js";
import { Restaurant } from "./models/Restaurant.js";
import { Booking } from "./models/Booking.js";


const MONGO_URI = process.env.MONGODB_URI || "";

const seedData = async ()=>{
    try{
        console.log("Connecting to Database for Seeding...")
        await mongoose.connect(MONGO_URI);
        console.log("Database Connected, Clearing Existing Connection...");

        await User.deleteMany({});
        await Restaurant.deleteMany({});
        await Booking.deleteMany({});

        console.log("Creating default User...");

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin123", salt);
        const userPassword = await bcrypt.hash("user123", salt);
        const ownerPassword = await bcrypt.hash("owner123", salt);
        
        const adminUser = await User.create({
            name: "Naman Gupta",
            email: "admin@example.com",
            password: adminPassword,
            phone: "8923953821",
            role: "admin"
        })

        const testUser = await User.create({
            name: "Satyam Sharma",
            email: "user@example.com",
            password: userPassword,
            phone: "8989032425",
            role: "user"
        })

        const ownerUser = await User.create({
            name: "Sarah Sharma",
            email: "owner@example.com",
            password: ownerPassword,
            phone: "9049029421",
            role: "owner"
        })

        console.log("Creating restaurants...");

        const resturantsData = [{

        name: "Dastan-e-Khas",
        slug: "dastan-e-khas",
        description:
            "An intimate, royal Awadhi dining hall wrapped in deep velvet interiors and soft warm candlelight. Dastan-e-Khas specializes in slow-cooked dum pukht biryanis and delicate kebabs, creating a rich sensory dialogue between regal culinary heritage and modern elegance.",
        cuisine: "North Indian / Awadhi",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 88,
        location: "South Mumbai, MH",
        address: "115 Colaba Causeway, Mumbai, MH 400001",
        image: "/restaurant_5.png",
        chefName: "Imtiaz Qureshi",
        tags: ["Fine Dining", "Royal Decor", "Candlelit", "Awadhi Dum Pukht"],
        availableSlots: ["18:00", "19:00", "20:00", "21:00", "22:00"],
        featured: true,
        exclusive: false,
    },
    {
        name: "Aastha Rooftop & Bar",
        slug: "aastha-rooftop-and-bar",
        description:
            "A sun-drenched open-air rooftop oasis celebrating modern coastal and South Indian flavors. Featuring tropical foliage, marble tables, and sweeping city views, Aastha serves house-made appams, coastal seafood, and botanical kokum cocktails.",
        cuisine: "Modern Coastal & South Indian",
        priceRange: "$$$",
        rating: 4.7,
        reviewCount: 205,
        location: "Bengaluru, KA",
        address: "244 100 Feet Rd Rooftop, Indiranagar, Bengaluru, KA 560038",
        image: "/restaurant_3.jpg",
        chefName: "Ananya Iyer",
        tags: ["Rooftop", "Skyline Views", "Craft Cocktails", "Coastal Delights"],
        availableSlots: ["12:00", "13:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
        featured: true,
        exclusive: false,
    },
    {
        name: "Hikari Japanese Counter",
        slug: "hikari-japanese-counter",
        description:
            "An atmospheric, dark-toned sanctuary of fine Japanese gastronomy in downtown Delhi. Seated around a minimalist granite counter, guests experience a highly focused omakase journey crafted with fresh imports and seasonal delicacies.",
        cuisine: "Japanese Omakase",
        priceRange: "$$$$",
        rating: 4.8,
        reviewCount: 92,
        location: "New Delhi, DL",
        address: "18 Meherchand Market, Lodhi Road, New Delhi, DL 110003",
        image: "/restaurant_2.jpg",
        chefName: "Kenji Sato",
        tags: ["Omakase", "Granite Counter", "Minimalist", "Zen Atmosphere"],
        availableSlots: ["18:00", "20:30"],
        featured: true,
        exclusive: true,
    },
    {
        name: "Vriksha Botanical Bistro",
        slug: "vriksha-botanical-bistro",
        description:
            "A bright glasshouse conservatory dedicated to organic, farm-to-table vegetarian gastronomy. Set under lush greenery, Vriksha turns seasonal indigenous produce into delicate and artistic plant-forward creations.",
        cuisine: "Organic Vegetarian",
        priceRange: "$$$",
        rating: 4.8,
        reviewCount: 110,
        location: "Bengaluru, KA",
        address: "90 Lavelle Road, Shanthala Nagar, Bengaluru, KA 560001",
        image: "/restaurant_6.png",
        chefName: "Priya Sharma",
        tags: ["Farm-to-Table", "Glasshouse", "Organic", "Plant-Forward"],
        availableSlots: ["11:30", "13:00", "14:30", "17:30", "19:00", "20:30"],
        featured: false,
        exclusive: false,
    },
    {
        name: "Angaar Charcoal Grill",
        slug: "angaar-charcoal-grill",
        description:
            "An upscale, contemporary grillhouse featuring exposed red brickwork, leather seating, and warm industrial accents. Specializing in live charcoal kebabs, aged meats, and sigree-cooked paneer platters.",
        cuisine: "Grill & Mughlai",
        priceRange: "$$$$",
        rating: 4.6,
        reviewCount: 142,
        location: "New Delhi, DL",
        address: "320 Connaught Place, Block B, New Delhi, DL 110001",
        image: "/restaurant_1.png",
        chefName: "Rohan Kapoor",
        tags: ["Live Charcoal", "Sigree Cooking", "Warm Lighting", "Craft Cocktails"],
        availableSlots: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
        featured: false,
        exclusive: false,
    },
    {
        name: "Villa Susegad",
        slug: "villa-susegad",
        description:
            "An avant-garde journey through modern Goan and Portuguese fusion dining inside a restored 19th-century Portuguese villa. Blending regional spice heritage with progressive culinary techniques.",
        cuisine: "Goan & Portuguese Fusion",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 124,
        location: "Assagao, Goa",
        address: "420 Badem Road, Assagao, Goa 403507",
        image: "/restaurant_4.png",
        chefName: "Xavier D'Souza",
        tags: ["Heritage Villa", "Fine Dining", "Tasting Menu", "Heritage Garden"],
        availableSlots: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
        featured: true,
        exclusive: true,
    },
];

    console.log("Inserting Restaurant...");

    const updateRestaurantData = resturantsData.map((restaurant, index)=>{
        const {...restInfo} = restaurant;
        return{
            ...restInfo,
            owner: ownerUser._id,
            status: "approved",
            totalSeats: 20 + index * 5,
        }
    })

    await Restaurant.insertMany(updateRestaurantData)
    console.log("Seeding complete! Disconnecting...");

    await mongoose.disconnect();
    console.log("Disconnected from Database.")


    }catch(error: any){
        console.error("Seeding Failed: ", error);
        process.exit(1);
    }
}

seedData();