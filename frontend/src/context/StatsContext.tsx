import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import { createGraphArray as createPointsArray, createGraphPoint, TGraph } from "../pages/Stats/Graph";
import dayController, { TDay, TGoalDays, TStat, wait } from '../controllers/days';
import { TUser, useUser } from "./AuthContext";
import { nextWeekTime } from "../utils";
import { sumDaysProgress } from "../pages/Goals/Goals";
import axios, { Axios } from "axios";
type TStatsStateProps = {
    stats: TGraph[],
    loading: boolean,
}
type TStatsContextProps = TStatsStateProps & {
    updateStats: (stats: TGoalDays[]) => void,
    reloadStats: ()=>void
} | null
const StatsContext = createContext<TStatsContextProps>(null);
export const nextDayTime = (date: number | Date) =>{
    let date1 = new Date(date);
    let date2 = new Date(date1);
    date2.setDate(date1.getDate() + 1);
    return date2.getTime()
}
const createGraphArray = (data: TGoalDays[]) => data.map((stat)=>{
        let {days, ...goal} = stat;
        return {
            goal: goal,
            points: createPointsArray(days,goal )
        }
    })
    

const StatsProvider = ({ children, user}: {children: ReactNode, user: TUser}) => {
    const [state, setState] = useState<TStatsStateProps>({stats: [], loading: true});
    const {goals, _id} = user ;
    const {stats} = state;
    useEffect(()=>{
       // console.log("reloading stats")
        dayController.getStats(_id).then(data =>{
            let result: TGraph[] = createGraphArray(data)
            setState({stats:result, loading: false})
         }).catch(err =>{
            if(axios.isCancel(err)){
                //console.log("cancel err")
            }else {
                //console.log("unexpected error")
            }
        })
    },[goals,_id])
    //const delay = 5000;
    const updateStats = (stats: TGoalDays[]) =>{
            let result: TGraph[] = createGraphArray(stats)
            setState({...state, stats:result})
    }
    const reloadStats =async() =>{
        setState({...state, loading: true});
        await wait(3000);
        dayController.getStats(_id).then(data =>{
            // Goal in stats is updated!!
            let result: TGraph[] = createGraphArray(data)
            setState({...state, loading: false, stats:result})
        });
        // Manually update stats, not recommended
        // console.log("updating stats")
        // let dayDate = new Date(day.date);
        // dayDate.setHours(0,0,0,0);
        // let newStats = stats.map(graph =>{
        //     if(graph.goal._id === day.goal._id){
        //         let newPoints = graph.points.map((point, i) =>{
        //             if(day.goal.frequency === "weekly"){
        //                 let nextWeek = new Date(day.date);
        //                 nextWeek.setDate(nextWeek.getDate() + 7)
        //                 if(day.date > point.date.getTime() && day.date < nextWeekTime(point.date).getTime()){
        //                     let updated = false;
        //                     let newPoint;
        //                     let newHistory: TDay[] = point.history.map((d, j) =>{ 
        //                         if(d._id === day._id){
        //                             updated = true;
        //                             return  day
        //                         }
        //                         return d
        //                     })
        //                     if(!updated) {
        //                         newHistory.push(day);
        //                     }
                            
        //                     let maxAmount = (100 *sumDaysProgress(point.history))/ point.progress;
        //                     newPoint = createGraphPoint(day.goal, newHistory, point.date, i, maxAmount)
        //                     //console.log({newPoint, maxAmount, amountHeight: point.amountHeight, sumDaysProgress: sumDaysProgress(newHistory), pointProgress: point.progress})
        //                     return  newPoint
        //                 }

        //                 console.log({point})
        //                 return point
        //             }else {
        //                 if(point.date.getTime() === dayDate.getTime()){
        //                     let maxAmount = (100 *sumDaysProgress(point.history))/ point.progress;
        //                     let newPoint = createGraphPoint(day.goal, [day], point.date, i, maxAmount);
        //                     //console.log({newPoint, maxAmount})
        //                     return newPoint;
        //                 }
        //                 return point
        //             }
                    
        //         })
        //         graph.points = newPoints;

        //     }
        //     return graph
        // })
        // console.log({newStats})
        // newStats.map(graph => graph.points.map(point => point.history.map(day => day.history.map((progress, i) =>{
        //     if(progress.notes === "cic") console.log(progress)
        // }))))
        // setState({stats: newStats})
    }
    return (
        <StatsContext.Provider value={{ ...state, updateStats, reloadStats}}>
            {children}
        </StatsContext.Provider>
    );
};
const useStats = () => {
    const statsContext = useContext(StatsContext);
    if(!statsContext) throw new Error("useStats shoud be used inside StatsContext!")
    return statsContext
};
export { StatsProvider, useStats };
