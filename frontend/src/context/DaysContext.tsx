import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import goalController, { TGoalForm, TGoal} from "../controllers/goals";
import dayController, { TDay, TGoalDays, TProgress, TProgressForm } from "../controllers/days";
import * as likeController from "../controllers/likes"
import { dayInMilliseconds, todayDate } from "../constants";
import { getLastMonday, getToday, isToday, nextWeekTime } from "../utils";
import { TUser, useAuth, useUser } from "./AuthContext";
import { nextDayTime } from "./StatsContext";
type TDaysContext = {
    daysLoading: boolean,
    //today: TDay | null,
    goals: TMyGoal[],
    addProgress: (goalId: string, progress: number, notes: string, date:number) => Promise<TDay>
    addGoal: (goal: TGoalForm) => Promise<void>
    editGoal: (goal: Omit<TGoal, "type">) => Promise<void>,
    deleteGoal: (id: string) => Promise<void>,
    editProgress: (progress: TProgressForm &{newDate: number}) => Promise<TDay>
    deleteProgress: (progress: TProgressForm) => Promise<TDay>,
    likeProgress: (progress: TProgressForm) => Promise<void>,
    unlikeProgress: (progress: TProgressForm) => Promise<void>
} | undefined;
const daysState = {
    today: null,
    days:[],
    //addProgress: (goalId: string, progress: )
}
export type TMyGoal = {
    history: TDay[]
} & TGoal;
/*
const getUpdatedGoalDays = (updatedDay: TDay, goals: TMyGoal[]) =>{
    let updatedGoals = goals.map(goal =>{
            let newGoal: TMyGoal = goal;
            if(goal._id === updatedDay.goal._id){
                if(goal.frequency === "daily"){
                    if(isToday(updatedDay.date)) {
                        newGoal = {...goal, history: [updatedDay]}
                    }
                }else if(goal.frequency === "weekly"){
                    let lastMonday = getLastMonday(Date.now()).getTime();
                    if(updatedDay.date > lastMonday && updatedDay.date < nextDayTime(lastMonday)){
                        let updated = false;
                        updatedDays = goal.history.map(day =>{
                            if(day._id === updatedDay._id){
                                updated = true;
                                return updatedDay
                            }
                            return day
                        })
                        if(!updated) updatedDays.push(updatedDay);
                        newGoal =  {...goal, history: updatedDays}
                    }
                }
            }
            return newGoal

        })
}
        */

const getUpdatedGoals = (goals: TMyGoal[], updatedDay: TDay, updateGoal?: boolean) =>{
    console.log("get",{updatedDay})
    let updatedDays: TDay[];
    let result = goals.map(goal =>{
            let newGoal: TMyGoal = goal;
            if(goal._id === updatedDay.goal._id){
                if(updateGoal) {
                    newGoal.amount = updatedDay.goal.amount;
                    newGoal.title = updatedDay.goal.title;
                    newGoal.frequency = updatedDay.goal.frequency;
                }
                if(goal.frequency === "daily"){
                    if(isToday(updatedDay.date)) {
                        newGoal = {...goal, history: [updatedDay]}
                    }
                }else if(goal.frequency === "weekly"){
                    let lastMonday = getLastMonday(Date.now()).getTime();
                    console.log({lastMonday: new Date(lastMonday)})
                    
                    if(updatedDay.date > lastMonday && updatedDay.date < nextWeekTime(lastMonday).getTime()){
                        let updated = false;
                        updatedDays = goal.history.map(day =>{
                            if(day._id === updatedDay._id){
                                updated = true;
                                return updatedDay
                            }
                            return day
                        })
                        if(!updated) updatedDays.push(updatedDay);
                        newGoal =  {...goal, history: updatedDays}
                    }
                }
            }
            return newGoal

        })
        return result;
}
// const getUpdatedGoalDays = (goals: TMyGoal[], updatedDays: TDay[], goalId: string) =>{
//     //let updatedDays: TDay[];
//     let result = goals.map(goal =>{
//             let newGoal: TMyGoal = goal;
//             if(goal._id === goalId){
//                 if(updateGoal) newGoal.amount = updatedDay.goal.amount;
//                 if(goal.frequency === "daily"){
//                     if(isToday(updatedDay.date)) {
//                         newGoal = {...goal, history: [updatedDay]}
//                     }
//                 }else if(goal.frequency === "weekly"){
//                     let lastMonday = getLastMonday(Date.now()).getTime();
//                     console.log({lastMonday: new Date(lastMonday)})
                    
//                     if(updatedDay.date > lastMonday && updatedDay.date < nextWeekTime(lastMonday).getTime()){
//                         let updated = false;
//                         updatedDays = goal.history.map(day =>{
//                             if(day._id === updatedDay._id){
//                                 updated = true;
//                                 return updatedDay
//                             }
//                             return day
//                         })
//                         if(!updated) updatedDays.push(updatedDay);
//                         newGoal =  {...goal, history: updatedDays}
//                     }
//                 }
//             }
//             return newGoal

//         })
//         return result;
// }
const DaysContext = createContext<TDaysContext>(undefined)
const DaysProvider = ({children, me}: {children: ReactNode, me?: TUser}) =>{
    //const [goals, setGoals] = useState<TGoal[]>([]);
    const  {updateUser, setLoading} = useAuth()
    let user = useUser();
    if(me) user = me;
    //console.log({user})
    const [daysLoading, setDaysLoading] = useState(true);
    const [goals, setGoals] = useState<TMyGoal[]>([]);
    //const [today, setToday] = useState<TDay | null>(null)
    //const [loading, setLoading] = useState(true);
    useEffect(() =>{
        if(!user.goals) return setDaysLoading(false);
        dayController.getDays().then((goals) =>{
            setGoals(goals);
            setDaysLoading(false)
        }).catch(err =>{
            //console.log("error fetching days: ", err)
        })
    },[])
    const addProgress = async(goalId: string, progress: number, notes: string, date: number)=>{
        setLoading(true)
        let updatedDay = await dayController.addProgress(goalId, progress, notes, date);
        let updatedGoals = getUpdatedGoals(goals, updatedDay);
        setGoals(updatedGoals)
        setLoading(false);
        return updatedDay
    }
    const addGoal = async(goalForm: TGoalForm) =>{
        setLoading(true)
        let newDay = await goalController.addGoal(goalForm);

        updateUser({...user, goals: [...user.goals, newDay.goal]})
        let updatedGoals: TMyGoal[] = [...goals, {...newDay.goal, history: []}]
        console.log({updatedGoals})
        setGoals(updatedGoals)

        setLoading(false)
    }
     const editGoal = async(goalForm: Omit<TGoal, "type">) =>{
        setLoading(true)
        let newDay = await goalController.editGoal(goalForm);
        let newGoals = user.goals.map(goal =>{
            if(goal._id === newDay.goal._id) return newDay.goal;
            return goal
        })
        console.log({newGoals})
        updateUser({...user, goals: newGoals});
        let updatedGoals = getUpdatedGoals(goals, newDay, true);
        console.log({updatedGoals})
        setGoals(updatedGoals)
        setLoading(false)
        
    }

    // const editGoalAmount =  async(goalForm: Omit<TGoal, "type">, date: number) =>{
    //     setLoading(true)
    //     if(goalForm.frequency === "daily"){
    //         let newDay = await goalController.editGoalAmount<TDay>(goalForm, date);
    //         let updatedGoals = getUpdatedGoals(goals, newDay, true)
    //         setGoals(updatedGoals)
    //     }else if(goalForm.frequency === "weekly"){
    //         let newDays = await goalController.editGoalAmount<TDay[]>(goalForm, date);
    //         let updatedGoals = getUpdatedGoalDays(goals, newDays, goalForm._id)
    //         setGoals(updatedGoals)
    //     }
    
       
    //     setLoading(false)
        
    // }
    const deleteGoal = async(id: string) =>{
        setLoading(true)
        let user= await goalController.deleteGoal(id);
        let updatedGoals = goals.filter(goal => goal._id !== id);
        setGoals(updatedGoals)
        updateUser(user)
        setLoading(false)
        
    }
    const editProgress = async(progress: TProgressForm & {newDate: number})=>{
        setLoading(true)
        let updatedDay = await dayController.updateProgress(progress);
        let updatedDays;
        let updatedGoals = goals.map(goal =>{
            updatedDays = goal.history.map(day =>{
                if(day._id === updatedDay._id){
                    return updatedDay
                }
                return day
            })
           
            return {...goal, history: updatedDays}
        })
        setGoals(updatedGoals);
        setLoading(false)
        return updatedDay
    }
    const deleteProgress = async(progress: TProgressForm)=>{
        setLoading(true)
        let updatedDay = await dayController.deleteProgress(progress)
        let updatedDays;
        let updatedGoals = goals.map(goal =>{
            updatedDays = goal.history.map(day =>{
                if(day._id === updatedDay._id){
                    return updatedDay
                }
                return day
            })
           
            return {...goal, history: updatedDays}
        })
        setGoals(updatedGoals);
        setLoading(false)
        return updatedDay
    }
    const likeProgress = async(progress: TProgressForm) =>{
        let updatedDay = await likeController.postLike(progress)
        let updatedDays;
        let updatedGoals = goals.map(goal =>{
            updatedDays = goal.history.map(day =>{
                if(day._id === updatedDay._id){
                    return updatedDay
                }
                return day
            })
           
            return {...goal, history: updatedDays}
        })
        setGoals(updatedGoals)
    }
    const unlikeProgress = async(progress: TProgressForm) =>{
        let updatedDay = await likeController.deleteLike(progress)
        let updatedDays;
        let updatedGoals = goals.map(goal =>{
            updatedDays = goal.history.map(day =>{
                if(day._id === updatedDay._id){
                    return updatedDay
                }
                return day
            })
           
            return {...goal, history: updatedDays}
        })
        setGoals(updatedGoals)
    }
    return (
        <DaysContext.Provider value={{goals,addProgress,daysLoading, addGoal, editGoal, deleteGoal, editProgress, deleteProgress, likeProgress, unlikeProgress}}>
            {children}
        </DaysContext.Provider>
    )
}
const useDays = () =>{
    let daysContext = useContext(DaysContext);
    if(!daysContext) throw new Error("useDays must be used inside DaysProvider");
    return daysContext;
}
export { useDays, DaysProvider};
