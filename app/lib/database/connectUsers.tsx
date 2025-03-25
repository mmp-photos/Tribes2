// import mongoose, { ConnectOptions } from "mongoose";

// const MONGODB_URI: string = process.env.ATLAS_URI ?? "";

// if (!MONGODB_URI) {
//     throw new Error("ATLAS_URI is not defined in environment variables.");
// }

// // Mongoose connection function
// export default async function connectUsers() {
//     try {
//         if (mongoose.connection.readyState >= 1) {
//             console.log("Already connected to MongoDB");
//             return mongoose.connection;
//         }

//         const options: ConnectOptions = {
//             dbName: "TribesOfMen",
//         };

//         await mongoose.connect(MONGODB_URI, options);

//         console.log("Connected to MongoDB via Mongoose");
//         return mongoose.connection;
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error("Error connecting to MongoDB:", error.message);
//         } else {
//             console.error("Error connecting to MongoDB:", error);
//         }

//         throw new Error("Failed to connect to MongoDB");
//     }
// }

import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI: string = process.env.ATLAS_URI ?? "";

if (!MONGODB_URI) {
    throw new Error("ATLAS_URI is not defined in environment variables.");
}

// Mongoose connection function
export default async function connectUsers() {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("Already connected to MongoDB");
            return mongoose.connection;
        }

        const options: ConnectOptions = {
            dbName: "TribesOfMen",
            // Other options as needed (e.g., serverSelectionTimeoutMS)
        };

        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Mongoose disconnected from MongoDB");
        });

        await mongoose.connect(MONGODB_URI, options);

        console.log("Connected to MongoDB via Mongoose");
        return mongoose.connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error); // Log the entire error object

        throw new Error("Failed to connect to MongoDB");
    }
}