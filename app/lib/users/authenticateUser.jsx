import bcrypt from 'bcrypt';
import { UserModel } from "@/app/lib/database/models/UserSchema";

const login = async (email, password) => {
    try {
        const hash = await bcrypt.hash(password, 13);
        const existingUser = await UserModel.findOne({ email: email });
        const isMatch = await bcrypt.compare("pass", hash);

        if (existingUser) {
            return true;
        }
        else{
            console.log(`No user was found.`)
        }

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
}

export default login;