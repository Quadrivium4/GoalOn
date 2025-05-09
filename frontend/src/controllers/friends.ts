// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { GenericAbortSignal } from "axios"
import { TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"
import { TDay, TProgress } from "./days"
import { TGoal } from "./goals"
import { TMyGoal } from "../context/DaysContext"
import { TNotification } from "../pages/Settings/Notifications/Notifications"
import { TFilter } from "../pages/Friends/SearchUser/SearchUser"

export type TFriendsResponse = {
    friends: TUser[],
    incomingFriendRequests: TUser[],
    outgoingFriendRequests: TUser[],
    friendDays: TDay[]
}
// }
// export type TLazyFriendsResponse = {
//         _id: string,
//         name: string,
//         profileImg: string | undefined,
//         goals: TGoal[],
//         days: (Omit<TDay, "history"> & {history: TProgress[][]})[]
//     }[]
export type TLazyFriendsResponse = {
        _id: string,
        name: string,
        profileImg: string | undefined,
        goals: TMyGoal[],
        goalsInfo: TGoal[]
    }[]
const getUsers= async({index, offset, search,filter, signal}: {index: number, search?: string, offset?: number,filter?: TFilter,  signal?: GenericAbortSignal}): Promise<TUser[]> =>{
    
    const res =  await protectedApi.get("/users", {params:{
        index, 
        offset,
        filter,
        search
    },
    signal: signal 
});
    return res.data
}
const getFriends = async(search?: string): Promise<TFriendsResponse> =>{
    if(search) {
        const res =  await protectedApi.get("/friend?search=" + search);
        return res.data
    }
    const res =  await protectedApi.get("/friend")
    return res.data
}
const getLazyFriends = async(index: number, controller?: GenericAbortSignal): Promise<TLazyFriendsResponse>=>{
    let date = new Date();
    date.setHours(0,0,0,0);
    
    const res = await protectedApi.get("/lazy-friends", {params: { index, timestamp: date.getTime()}, signal: controller});
    return res.data;
} 
const sendFriendRequest = async(id: string): Promise<TUser> =>{
    let res = await protectedApi.post("/send-friend-request/" + id);
    return res.data;
}
const acceptFriendRequest = async(id: string): Promise<TUser> =>{
    let res = await protectedApi.post("/accept-friend-request/" + id)
    return res.data;
}
const cancelFriendRequest = async(id: string): Promise<TUser> =>{
    let res = await protectedApi.delete("/cancel-friend-request/" + id);
    return res.data;
}
const ignoreFriendRequest = async(id: string): Promise<TUser> =>{
    let res = await protectedApi.delete("/ignore-friend-request/" + id);
    return res.data;
}
const deleteFriend = async(id: string): Promise<TUser> =>{
    let res = await protectedApi.delete("/delete-friend/" + id);
    return res.data;
}
const getNotifications = async(): Promise<TNotification[]> =>{
    let res = await protectedApi.get("/notifications",{params: {timestamp: Date.now()}});
    return res.data;
}
const readNotifications = async(ids: string[]): Promise<TNotification[]> =>{
    let res = await protectedApi.post("/notifications",{ids});
    
    return res.data;
}
const unfollow = async(id: string): Promise<TUser> =>{
    let res = await protectedApi.delete("/unfollow/" + id);
    return res.data;
}
export  {
    getUsers,
    getFriends,
    getNotifications,
    readNotifications,
    getLazyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    ignoreFriendRequest,
    deleteFriend,
    unfollow
}