import { UserModel } from "../../models/UserSchema";

interface CreateUserInput {
    email: string;
    password: string;
}

export async function findByUser(userInput: CreateUserInput) {
    const userToFind = userInput
    try {
        // Check if a user with the same email already exists
        console.log(userInput.email)
        const existingUser = await UserModel.findOne({ email: userInput.email });
        console.log(existingUser);
        if (existingUser) {
            return true;
        }
        else{
            return `No user was found`;
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
