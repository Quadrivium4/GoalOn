
// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { GenericAbortSignal } from "axios"
import { TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"
import { TDay, TProgress, TProgressForm } from "./days"
import { TGoal } from "./goals"
import { TMyGoal } from "../context/DaysContext"

const postLike = async(progress: TProgressForm): Promise<TDay> =>{
    let res = await protectedApi().post("/likes", progress);
    return res.data;
}
const deleteLike = async(progress: TProgressForm):Promise<TDay> =>{
    let res = await protectedApi().delete("/likes", {params: {id: progress.id, timestamp: progress.date}});
    return res.data;
}

export {
    postLike,
    deleteLike
}