import mongoose,  { Types }  from "mongoose";
export interface TGoal  {
    _id: Types.ObjectId,
    title: string,
    type: "time" | "distance" | "number",
    frequency: "daily" | "weekly" | "monthly",
    description: string,
    amount: number
}

export interface TNotification {
    _id: string,
    date: number,
    content: string,
    type: "like" | "incoming request" | "accepted request" | "comment", 
    from: {
        name: string,
        userId: string,
    }
    status: "read" | "unread"
}
export interface TUser extends mongoose.Document  {
    name: string,
    email: string,
    password: string,
    tokens: string[],
    profileImg: string,
    goals: TGoal[],
    friends: string[],
    bio: string,
    googleLogin?: boolean,
    outgoingFriendRequests: string[],
    incomingFriendRequests: string[],
    followers: string[],
    following: string[],
    deletionToken?: string,
    notifications: TNotification[]
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
    googleLogin: {
        type: Boolean
    },
    tokens: [],
    goals: [],
    friends: [],
    bio: {
        type: String,
        trim: true
    },
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
    profileImg: {
        type: String
    },
    deletionToken: {
        type: String
    },
    notifications: [],
    followers: [],
    following: []
});

const User = mongoose.model<TUser>("User", UserSchema);
export default User