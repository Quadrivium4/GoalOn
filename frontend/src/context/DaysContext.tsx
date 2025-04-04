import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import goalController, { TGoalForm, TGoal} from "../controllers/goals";
import dayController, { TDay, TProgress, TProgressForm } from "../controllers/days";
import * as likeController from "../controllers/likes"
import { dayInMilliseconds, todayDate } from "../constants";
import { getLastMonday, getToday, isToday } from "../utils";
import { useAuth, useUser } from "./AuthContext";
import { nextDayTime } from "../pages/Stats/StatsContext";
type TDaysContext = {
    today: TDay | null,
    goals: TMyGoal[],
    addProgress: (goalId: string, progress: number, notes: string, date:number) => Promise<TDay>
    addGoal: (goal: TGoalForm) => Promise<void>
    editGoal: (goal: TGoalForm) => Promise<void>,
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
} & TGoal
const DaysContext = createContext<TDaysContext>(undefined)
const DaysProvider = ({children}: {children: ReactNode}) =>{
    //const [goals, setGoals] = useState<TGoal[]>([]);
    const  {updateUser, setLoading} = useAuth()
    const user = useUser();
    const [goals, setGoals] = useState<TMyGoal[]>([]);
    const [today, setToday] = useState<TDay | null>(null)
    //const [loading, setLoading] = useState(true);
    useEffect(() =>{
        dayController.getDays().then(setGoals).catch(err =>{
            console.log("error fetching days: ", err)
        })
    },[])
    const addProgress = async(goalId: string, progress: number, notes: string, date: number)=>{
        let updatedDay = await dayController.addProgress(goalId, progress, notes, date);

        let updatedDays: any[];
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
        setGoals(updatedGoals)
        return updatedDay
    }
    const addGoal = async(goalForm: TGoalForm) =>{
        setLoading(true)
        let newDay = await goalController.addGoal(goalForm);

        updateUser({...user, goals: [...user.goals, newDay.goal]})
        let updatedGoals = goals.map(goal =>{
            if(newDay.goal._id == goal._id){
                return {...goal, history: [...goal.history, newDay]}
            }
            return goal
        })
        setGoals(updatedGoals)

        setLoading(false)
    }
     const editGoal = async(goalForm: TGoalForm) =>{
        setLoading(true)
        let newDay = await goalController.editGoal(goalForm);

        updateUser({...user, goals: [...user.goals, newDay.goal]})
        let updatedGoals = goals.map(goal =>{
            if(newDay.goal._id == goal._id){
                return {...goal, history: [...goal.history, newDay]}
            }
            return goal
        })
        setGoals(updatedGoals)
        setLoading(false)
        
    }
    const deleteGoal = async(id: string) =>{
        setLoading(true)
        let goals = await goalController.deleteGoal(id);

        updateUser({...user, goals: goals})
        setLoading(false)
        
    }
    const editProgress = async(progress: TProgressForm & {newDate: number})=>{
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
        setGoals(updatedGoals)
        return updatedDay
    }
    const deleteProgress = async(progress: TProgressForm)=>{
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
        setGoals(updatedGoals)
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
        <DaysContext.Provider value={{goals,today, addProgress, addGoal, editGoal, deleteGoal, editProgress, deleteProgress, likeProgress, unlikeProgress}}>
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
