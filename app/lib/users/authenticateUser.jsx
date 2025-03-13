import bcrypt from 'bcrypt';
import { UserModel } from "@/app/lib/database/models/UserSchema";
import connectUsers from "@/app/lib/database/connectUsers";

export const login = async (email, password) => {
    try {
        await connectUsers();
        const existingUser = await UserModel.findOne({ email });

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

        return {
            success: true,
            user: {
                email: existingUser.email,
                accountType: existingUser.accountType,
                profileId: existingUser.profile,
            },
        }
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, error: "An unknown error occurred." };
    }
};