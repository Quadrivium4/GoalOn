import { TMyGoal } from "../context/DaysContext"
import { protectedApi } from "../utils"
import { TGoal } from "./goals"

export type TLike = {
    userId: string,
    username: string,
    profileImg: string
}
export type TProgress = {
    date: number,
    progress: number,
    notes: string,
    likes: TLike[]
}
export type TGoalAmountType = "distance" | "time" | "other"
export type TDayGoal = {
    title: string,
    goalId: string,
    type: TGoalAmountType,
    amount: number,
    progress: number,
    frequency: "daily" | "weekly" | "monthly"
}
export type TDayForm = {
    date: number,
    progress: number,
    history: TProgress[],
    goal: TGoal
}
export type TDay = TDayForm & {
    _id: string,
    utcDate: Date,
}
export type TStats = {
    _id: string,
    days: TDay[],
    title: string
};
export type TGoalDays =  TGoal & {
    days: TDay[]
}
export type TStat = TGoal & {
    days: TDay[][]
}
export type TProgressForm = Omit<TProgress, "likes"> & {id: string}
export function wait(duration: number){
    return new Promise((resolve, reject) => setTimeout(resolve, duration))
}
const getDays = async(userId?: string):Promise<TMyGoal[]> =>{
    //await wait(2000)
    let res = await protectedApi.get("/days", {params: {timestamp: Date.now(), id: userId}});
    return res.data;
}
const getStats = async(userId?: string):Promise<TGoalDays[]> =>{
    //console.log("mine", {userId})
    let res = await protectedApi.get(userId? "/stats/" + userId : "/stats");
    return res.data;
}
const addProgress = async(goalId: string, progress: number, notes: string, date: number): Promise<TDay> =>{
    let res = await protectedApi.post("/progress", {goalId, progress, date, notes});
    return res.data;
}
const updateProgress = async(progress: TProgressForm & {newDate: number}): Promise<TDay> =>{
    let res = await protectedApi.put("/progress", progress);
    return res.data;
}
const deleteProgress = async(progress: TProgressForm): Promise<TDay> =>{
    let res = await protectedApi.delete("/progress", {params: progress});
    return res.data;
}
let dayControllers = {
    getDays,
    addProgress,
    getStats,
    updateProgress,
    deleteProgress
}
export default dayControllers
export {
    getDays,
    addProgress,
    getStats,
    updateProgress,
    deleteProgress
}
