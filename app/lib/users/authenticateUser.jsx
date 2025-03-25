import bcrypt from 'bcrypt';
import { UserModel } from "@/app/lib/database/models/UserSchema";
import connectUsers from "@/app/lib/database/connectUsers";
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { ProfileModel } from "@/app/lib/database/models/ProfileSchema"; // Import your Profile model

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const login = async (email, password) => {
    try {
        await connectUsers();
        const existingUser = await UserModel.findOne({ email }).populate('profile'); // Populate the profile

        if (!existingUser) {
            console.log("User not found.");
            return { success: false, error: "User not found." }; // Specific error message
        }

        console.log("Stored hash:", existingUser.password);
        console.log("Input password:", password);

        // Use model's comparePassword method
        const isMatch = await existingUser.comparePassword(password);
        console.log(`Password match: ${isMatch}`);

        if (!isMatch) {
            return { success: false, error: "Incorrect password." }; // Specific error message
        }

        // Generate JWT
        const token = jwt.sign(
            { user: { _id: existingUser._id, email: existingUser.email, profile: existingUser.profile } },
            JWT_SECRET,
            { expiresIn: '1h' } // Set token expiration
        );

        return {
            success: true,
            user: {
                email: existingUser.email,
                accountType: existingUser.accountType,
                profile: existingUser.profile, // Return the populated profile
            },
            token: token, // Return the JWT
        };
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, error: "An unknown error occurred." };
    }
};