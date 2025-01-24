import { UserModel } from "../../models/UserSchema";

interface CreateUserInput {
    email: string;
    password: string;
    accountStatus: string;
    accountType: string;
    dateCreated: Date;
    lastLogin: Date;
    lastLogout: Date;
    termsAccepted: object;
    termsAcceptedOn: Date;
    profile: object
}

export async function insertUser(userInput: CreateUserInput) {
    try {
        // Check if a user with the same email already exists
        const existingUser = await UserModel.findOne({ email: userInput.email });
        if (existingUser) {
            throw new Error("A user with this email already exists.");
        }

        // Create a new user instance
        // const newUser = new UserModel(userInput);

        // Save the user to the database
        // const savedUser = await newUser.save();

        // return { success: true, data: savedUser };
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
