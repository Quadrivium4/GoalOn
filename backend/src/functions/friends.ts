import User, { TNotification, TUser } from "../models/user.js"
import { ObjectId } from "mongodb";
const getUserFriends = async(user: TUser) =>{
    const friends = await User.find({id: {$in: user.friends}});
    return friends;
}
const createNotification = (part: Omit<TNotification, "_id">): TNotification => ({
    ...part,
    _id: new ObjectId().toHexString()
})
const addNotification = async(userId: string, part: Omit<TNotification, "_id">) =>{
    let notification: TNotification = {
        ...part,
        _id: new ObjectId().toHexString()
    };
    const user = await User.findByIdAndUpdate(userId,{$push: {notifications: notification}});
    return user;
}
const deleteRequestsNotification = (notifications: TNotification[], requestUserId: string ) =>{
    const newNotifications = [];
    for(let notification of notifications){
      if(!(notification.type == "incoming request" && notification.from.userId == requestUserId))  {
        newNotifications.push(notification);
      }
    }
    return newNotifications
}
const removeRequestAndNotification = async(requestingId: string, receivingId: string) =>{
    console.log({requestingId, receivingId})
    const friend = await User.findByIdAndUpdate(requestingId, {
        $pull: {
            outgoingFriendRequests: receivingId
        },
    }, { new: true })

    console.log(typeof requestingId)
    const user = await User.findByIdAndUpdate(receivingId, {
        $pull: {
            incomingFriendRequests: requestingId,
            notifications: {
                type: "incoming request",
                "from.userId": requestingId
            }
        }
    }, { new: true });
    console.log("not length", user.notifications.length)
    return user;
}
const deleteOldNotifications = async(userId: string, date: number | Date) =>{
    date = new Date(date);
    date.setHours(0,0,0,0);
    const user =  await User.findByIdAndUpdate(userId,{$pull: {notifications: { date: {$lte: date.getTime()}, status: "read", type: {$ne: "incoming request"}}}});
    return user;
}
export {
    getUserFriends,
    addNotification,
    deleteOldNotifications,
    deleteRequestsNotification,
    removeRequestAndNotification,
    createNotification
}