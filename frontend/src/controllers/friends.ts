// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { GenericAbortSignal } from "axios"
import { TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"
import { TDay, TProgress } from "./days"
import { TGoal } from "./goals"
import { TMyGoal } from "../context/DaysContext"
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
const getUsers= async({index, offset, search, signal}: {index: number, search?: string, offset?: number, signal?: GenericAbortSignal}): Promise<TUser[]> =>{
    
    const res =  await protectedApi.get("/users", {params:{
        index, 
        offset,
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
const deleteFriend = async(id: string): Promise<TUser> =>{
    let res = await protectedApi.delete("/delete-friend/" + id);
    return res.data;
}

export  {
    getUsers,
    getFriends,
    getLazyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    deleteFriend
}