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
            //useUnifiedTopology: true, // No longer needed
            //useNewUrlParser: true, // No longer needed
            //bufferCommands: false, // Prevents buffering of commands when not connected
        };

        await mongoose.connect(MONGODB_URI, options);

        console.log("Connected to MongoDB via Mongoose");
        return mongoose.connection;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error connecting to MongoDB:", error.message);
        } else {
            console.error("Error connecting to MongoDB:", error);
        }

        throw new Error("Failed to connect to MongoDB");
    }
}