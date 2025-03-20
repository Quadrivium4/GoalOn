import User from "../models/user.js";
const getUserFriends = async (user) => {
    const friends = await User.find({ id: { $in: user.friends } });
    return friends;
};
export { getUserFriends };
//# sourceMappingURL=friends.js.map