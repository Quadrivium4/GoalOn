import AddProgress from "../../../components/AddProgress";
import { useUser } from "../../../context/AuthContext";
import { usePop } from "../../../context/PopContext";
import { useStats } from "../../../context/StatsContext";
import { getGoalAmountString, sumDaysProgress } from "../../Goals/Goals";
import ProgressDays from "../../Goals/ProgressDays";
import { EditGoalAmount, getPercentage, getProgressColor, normalizePercentage, TGraphPoint } from "../Graph";
import styles from "./PointPop.module.css"
const PointHeader = ({progressWidth}: {progressWidth: number}) =>{
    return (
        <>
        {progressWidth > 0? 
        <div className={styles.header} >
            <div className={styles.progress} style={{width: progressWidth + "%",backgroundColor: getProgressColor(progressWidth)}}></div>
        </div>: null}
        </>)
}
export default function PointPop ({point}: {point: TGraphPoint}){
    const {reloadStats} = useStats()
    const date = new Date(point.date);
    const now = new Date()
    const {setPop} = usePop();
    const user = useUser();
    console.log(point)
    date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    let goalDays =  point.history;
    let {goal } = point;
    let goalProgress = sumDaysProgress(goalDays);
    let progressWidth = normalizePercentage(getPercentage(goal.amount, goalProgress));
    let goalAmountString = getGoalAmountString(goal, goalProgress)
    return (
        <div className={styles["point-pop"]}> 
            <div className={styles.info}>
                <p>{goalAmountString} {goal.frequency}</p>
            </div>
            <PointHeader progressWidth={progressWidth}/>
            <ProgressDays history={point.history} setPop={setPop} onChange={reloadStats}/>
            {user._id === goal.userId? <div className={styles.buttons}>
                <button className='outline' onClick={() => setPop(<AddProgress goal={point.goal}  closePop={()=>setPop(undefined)} date={date.getTime()} onRes={reloadStats}/>)}>add progress</button>
                <button className='outline gray' onClick={() => setPop(<EditGoalAmount goal={point.goal}  date={point.date.getTime()} closePop={() => setPop(undefined)}/>)}>Edit goal</button>
            </div>: null}
        </div>
    )

}