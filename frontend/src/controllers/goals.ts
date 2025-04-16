// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"
import { TDay, TGoalAmountType } from "./days"
export type TGoalForm = {
     userId: string,
    progress: number,
    title: string,
    type: TGoalAmountType,
    amount: number,
    frequency:  "daily" | "weekly" | "monthly"
}
export type TGoal =  TGoalForm & {
    _id: string
} 
// }
const addGoal = async(goalForm: TGoalForm): Promise<TDay> =>{
    const res =  await protectedApi.post("/goals", {goalForm, date: Date.now()})
    return res.data
}
const editGoal = async(goal: TGoal): Promise<TDay> =>{
    const res =  await protectedApi.put("/goals", {...goal, date: Date.now()})
    return res.data
}
const deleteGoal = async(id: string): Promise<TUser> =>{
    const res =  await protectedApi.delete("/goals", {params: {id}});
    return res.data
}
export default {
    addGoal,
    editGoal,
    deleteGoal
}