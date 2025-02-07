import mongoose from "mongoose";

const MONGODB_URI: string = process.env.ATLAS_URI ?? "";

if (!MONGODB_URI) {
    throw new Error("ATLAS_URI is not defined in environment variables.");
}

// Mongoose connection function
export async function connectUsers() {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("Already connected to MongoDB");
            return mongoose.connection;
        }

        await mongoose.connect(MONGODB_URI, {
            dbName: "TribesOfMen",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);

        console.log("Connected to MongoDB via Mongoose");
        return mongoose.connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
