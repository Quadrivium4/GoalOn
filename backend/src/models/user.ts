import mongoose from "mongoose";
import { TGoal } from "./goal.js";
export interface TUser extends mongoose.Document  {
    name: string,
    email: string,
    password: string,
    tokens: string[],
    profileImg: string,
    goals: TGoal[],
    friends: string[],
    outgoingFriendRequests: string[],
    incomingFriendRequests: string[]
}
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
    },

    tokens: [],
    goals: [],
    friends: [],
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
    profileImg: {
        type: String
    }
});

const User = mongoose.model<TUser>("User", UserSchema);
export default User