import bcrypt from 'bcrypt';
import { UserModel } from "@/app/lib/database/models/UserSchema";

export const login = async (email, password) => {
    try {        
        const existingUser = await UserModel.findOne({ email: email });
        const hash = await bcrypt.hash(password, 13);
        // console.log(`Found an existingUser: ${existingUser}`);
        // console.log(`The password passed to the function is ${password}`);
        // console.log(`The password found in the database ${existingUser.password}`);
        const isMatch = await bcrypt.compare(password, hash);
        console.log(`isMatch: ${isMatch}`)
        return isMatch;

    } catch (error) {
        console.error("Error inserting user:", error);
        if (error instanceof Error) {
            console.error("Error inserting user:", error.message);
            return { success: false, error: error.message };
        } else {
            console.error("Unknown error occurred:", error);
            return { success: false, error: "An unknown error occurred" };
        }
    }
};