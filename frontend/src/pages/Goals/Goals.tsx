import { ReactNode, useEffect } from 'react';
import AddGoal from '../../components/AddGoal';
import AddProgress from '../../components/AddProgress';
import DeleteGoal from '../../components/DeleteGoal';
import EditGoal from '../../components/EditGoal';
import GoalSkeleton from '../../components/GoalSkeleton';
import Pop from '../../components/Pop/Pop';
import { useAuth, useUser } from '../../context/AuthContext';
import { TMyGoal, useDays } from '../../context/DaysContext';
import { usePop } from '../../context/PopContext';
import { TDay, TGoalAmountType } from '../../controllers/days';
import { TGoal } from '../../controllers/goals';
import { getTimeAmount } from '../../utils';
import { getPercentage, getProgressColor } from '../Stats/Graph';
import "./Goals.css";
import ProgressDays from './ProgressDays';
import { NotificationBell } from '../Settings/Notifications/Notifications';

export function sameDay(date1: Date | number, date2: Date | number){
    date1 = new Date(date1);
    date2 = new Date(date2);
    if(date1.getDay() === date2.getDay() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()) return true
    return false
}
export function isYesterday(date1: Date | number){
    date1 = new Date(date1);
    date1.setDate(date1.getDate() + 1);
    return sameDay(Date.now(), date1);
}
export function getTime(date: Date | number) {
    date = new Date(date);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2,"0")}`
}
export function getDate(date: Date | number) {
    date = new Date(date);
    return date.toLocaleDateString("eng", {month: "short",day: "numeric"});
}
export function formatDate(date: Date | number):string{
    date = new Date(date)
    return `${getDate(date)} at ${getTime(date)}`
}
export function getAmountString(amount: number, type: TGoalAmountType):string{
  let string = type === "time"? getTimeAmount(amount) + " hours": type === "distance"?  amount/1000 + "km": amount + "";
  return string
}
/*

function Goals() {
    const user = useUser();
    const {goals } = user;
    const {days, today, addProgress} = useDays();
    const [pop, setPop] = useState<ReactNode>();
    useEffect(()=>{
      console.log({days})
      //worker.postMessage("hello")
    },[days])
    //console.log(user)
  return (
    <div className='page' id='goals'>
      {pop && <Pop toggle={() => setPop(undefined)}>{pop}</Pop>}
    
      <div className='goals'>
        {
          days.map(day=>{
            console.log("myday",day)
            let {goal} = day
            let goalProgress = day.progress;
            let progressWidth = 100 /goal.amount* goalProgress;
            let goalAmountString = goal.type === "time"? getTimeAmount(goalProgress) + "/" +getTimeAmount(goal.amount) + " hours": goal.type === "distance"? goalProgress/1000 + "/" + goal.amount/1000 + "km": goal.amount;
            return (
              <div className='goal' key={day._id}>
                <div className='header'><div className='progress' style={{width: progressWidth + "%"}}></div></div>
                <div className='info'>
                  <h3>{goal.title}</h3>
                  <p>{goalAmountString} {goal.frequency}</p>
                </div>
                <div className='sub-progresses'>
                {
                  day.history.map(progress =>{
                    let date = new Date(progress.date);
                    return (<>
                      <div className='sub-progress'>
                        <div className='header'>
                          <p>{sameDay(date, Date.now())? "Today" : formatDate(date)}</p>
                          <p>{getAmountString(progress.progress, goal.type)}</p>

                        </div>
                        <p>{progress.notes}</p>
                      </div>
                    </>)
                  })
                }
                </div>
                <div className='footer'>
                <button className='outline' onClick={() => setPop(<AddProgress  day={day}  closePop={()=>setPop(undefined)}/>)}>add progress</button>
                
                <MdOutlineModeEditOutline size={24} onClick={() =>setPop(<EditGoal goal={day.goal} closePop={() =>setPop(undefined)} />)} className='edit-icon' />
                </div>
              </div>
            )
          })
        }

      </div>
   
      <button onClick={() =>{
        setPop(<AddGoal closePop={()=>setPop(undefined)} />)
      }}>+</button>
    </div>
  );
}*/
export function sumDaysProgress(days: TDay[]){
  let sum = 0;
  for(let i = 0; i< days.length; i++)
    sum += sumDayProgress(days[i]);
  return sum;
}
export function sumDayProgress(day: TDay){
 
  let sum = 0;
  //if(!day.history) return 0;
  for(let i = 0; i < day.history.length; i++){
    sum+= day.history[i].progress;
  }
  return sum;
}
export function getDayStrings(day: TDay, goal: TGoal, frequency?: TGoal["frequency"]){

}
export function formatTime(date: Date | number){
  date = new Date(date);
  return 
}


export function getGoalAmountString(goal: TGoal, goalProgress: number){
  return  goal.type === "time"? getTimeAmount(goalProgress) + "/" +getTimeAmount(goal.amount) + " hours": goal.type === "distance"? goalProgress/1000 + "/" + goal.amount/1000 + "km": goal.amount;
}
export function SingleGoal({goal, setPop, closePop}: {goal: TMyGoal, setPop: (content: ReactNode) =>void, closePop: () => void}){
  //console.log({goal})
  let goalDays =  goal.history;
  let goalProgress = sumDaysProgress(goalDays);
  let progressWidth = getPercentage(goal.amount, goalProgress);
  let goalAmountString = getGoalAmountString(goal, goalProgress)
  return (
      <div className='goal'>
        <div className='header'><div className='progress' style={{width: progressWidth + "%", backgroundColor: getProgressColor(progressWidth)}}></div></div>
        <div className='info'>
          <h3>{goal.title}</h3>
          <p>{goalAmountString} {goal.frequency}</p>
        </div>
        <ProgressDays history={goalDays} setPop={setPop} />
       
        <div className='footer'>
          <div style={{display: 'flex', gap: "5px"}}>
            <button className='outline' onClick={() => setPop(<AddProgress goal={goal}  closePop={closePop}/>)}>add progress</button>
          </div>
          <div style={{display: 'flex', gap: "5px"}}>
              {/* <MdOutlineModeEditOutline size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' /> */}
              {/* <MdDelete size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' /> */}
            <button className='outline gray' onClick={() =>setPop(<EditGoal goal={goal} closePop={closePop} />)} >edit</button>
            <button className='outline error' onClick={()=> setPop(<DeleteGoal goal={goal} closePop={closePop} />)}>delete</button>
          </div>
        </div>
      </div>
    )
}

//* VERSION 2 */
function Goals() {
    const user = useUser();
    const {loading} = useAuth();

    console.log("goals rendering")
    //const {goals } = user;
    const {goals, addProgress, daysLoading} = useDays();
    const {setPop} = usePop();
    useEffect(()=>{
      //console.log("remount")
      // console.log(user)
      //console.log({goals})
      //worker.postMessage("hello")
    },[])
  return (
    <div className='page' id='goals'>
      
      <div className="header">
          <h1>Goals</h1>
            <NotificationBell setPop={setPop} />
      </div>
     
      <div className='goals'>
        {
          user.goals.length > 0 && daysLoading? <GoalSkeleton goals={user.goals} />:
          goals?.length > 0? goals.map(goal=>{
            let {history, ...goalInfo} = goal;
            if(!goal) return <SingleGoal goal={{...goalInfo, history: []}} setPop={setPop} closePop={() => setPop(undefined)} key={goalInfo._id}/>
            return <SingleGoal goal={goal}  setPop={setPop} closePop={() => setPop(undefined)}  key={goalInfo._id}/>
          }): <p>no goals</p>
        }

      </div>
      <button onClick={() =>{
        setPop(<AddGoal closePop={()=>setPop(undefined)} />)
      }}> new Goal</button>
    {/* <button onClick={()=> window.open('tel:+393478619432', '_system')}>error</button> */}
    {/* <Admin /> */}
    </div>
  );
}

export default Goals;

