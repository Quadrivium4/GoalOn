import mongoose from "mongoose";
var UserSchema = new mongoose.Schema({
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
        trim: true
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
    notifications: []
});
var User = mongoose.model("User", UserSchema);
export default User;
