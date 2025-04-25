// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"
import { TDay, TGoalAmountType, TGoalDays } from "./days"
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
const editGoal = async(goal: Omit<TGoal, "type">, date?: number): Promise<TDay> =>{
    const res =  await protectedApi.put("/goals", {...goal, date: date || Date.now()})
    return res.data
}
const editGoalAmount = async(goal: Omit<TGoal, "type">, date: number): Promise<TGoalDays[]> =>{
    const res =  await protectedApi.put("/goal-amount", {...goal, date: date })
    return res.data
}
const deleteGoal = async(id: string): Promise<TUser> =>{
    const res =  await protectedApi.delete("/goals", {params: {id}});
    return res.data
}
let controller =  {
     addGoal,
    editGoal,
    deleteGoal,
    editGoalAmount
}
export {
    addGoal,
    editGoal,
    deleteGoal,
    editGoalAmount
}
export default controller