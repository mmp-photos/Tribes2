import { UserModel } from "../../models/UserSchema";
import { connectToDatabase } from "../databasae/connectToDatabase";

interface CreateUserInput {
    email: string;
    password: string;
    accountStatus?: string;
    accountType?: string;
    dateCreated?: Date;
    lastLogin?: Date;
    lastLogout?: Date;
    termsAccepted?: string;
    termsAcceptedOn?: Date;
    profile?: string;
}

interface InsertUserResult {
    success: boolean;
    data: any;
    error: string;
}

export async function insertUser(userInput: CreateUserInput): Promise<InsertUserResult> {
    try {
        await connectToDatabase();
        // const existingUser = await UserModel.findOne({ email: userInput.email });
        // if (existingUser) {
        //     return { success: false, error: "A user with this email already exists." };
        // }
    
        // const newUser = new UserModel(userInput);
        // const savedUser = await newUser.save();
        // return { success: true, data: savedUser };
        console.log(`It's late`)
        return({    success: true,
            data: "test",
            error: "test2"
        })
    } catch (error) {
        console.log(error)
        return({    success: true,
            data: "test",
            error: "test2"
        })
        // console.error("Error creating user:", error);
        // return { success: false, error: "Internal server error" };
    }
}
