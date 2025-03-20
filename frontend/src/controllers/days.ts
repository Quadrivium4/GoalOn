import { TMyGoal } from "../context/DaysContext"
import { protectedApi } from "../utils"
import { TGoal } from "./goals"

export type TLike = {
    userId: string,
    name: string,
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
    _id: string
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

const getDays = async():Promise<TMyGoal[]> =>{
    let res = await protectedApi().get("/days", {params: {timestamp: Date.now()}});
    return res.data;
}
const getStats = async(userId?: string):Promise<TGoalDays[]> =>{
    console.log("mine", {userId})
    let res = await protectedApi().get(userId? "/stats/" + userId : "/stats");
    return res.data;
}
const addProgress = async(goalId: string, progress: number, notes: string): Promise<TDay> =>{
    let res = await protectedApi().post("/progress", {goalId, progress, date: Date.now(), notes});
    return res.data;
}
const updateProgress = async(progress: TProgressForm): Promise<TDay> =>{
    let res = await protectedApi().put("/progress", progress);
    return res.data;
}
const deleteProgress = async(progress: TProgressForm): Promise<TDay> =>{
    let res = await protectedApi().delete("/progress", {params: progress});
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
// export {
//     getDays,
//     addProgress,
//     getStats,
//     updateProgress,
//     deleteProgress
<<<<<<< HEAD
// }
=======
// }
>>>>>>> master
