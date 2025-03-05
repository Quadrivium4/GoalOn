import User, { TUser } from "../models/user.js"

const getUserFriends = async(user: TUser) =>{
    const friends = await User.find({id: {$in: user.friends}});
    return friends;
}
export {
    getUserFriends
}