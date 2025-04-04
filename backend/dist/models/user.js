import mongoose from "mongoose";
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
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
    profileImg: {
        type: String
    }
});
const User = mongoose.model("User", UserSchema);
export default User;
//# sourceMappingURL=user.js.map