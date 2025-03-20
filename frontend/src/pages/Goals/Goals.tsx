import React,{ReactNode, useEffect, useState} from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import Pop from '../../components/Pop/Pop';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import AddGoal from '../../components/AddGoal';
import "./Goals.css"
import AddProgress from '../../components/AddProgress';
import { TMyGoal, useDays } from '../../context/DaysContext';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditGoal from '../../components/EditGoal';
import { TDay, TGoalAmountType } from '../../controllers/days';
import { getTimeAmount } from '../../utils';
import EditProgress from '../../components/EditProgress';
import DeleteGoal from '../../components/DeleteGoal';
import { TGoal } from '../../controllers/goals';

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
export function formatDate(date: Date | number):string{
    date = new Date(date)
    return `${date.toLocaleDateString("eng", {month: "short",day: "numeric"})} at ${getTime(date)}`
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
export function sumDayProgress(day: TDay){
  let sum = 0;
  //if(!day.history) return 0;
  for(let i = 0; i < day.history.length; i++){
    sum+= day.history[i].progress;
  }
  return sum;
}
function SubProgress({day, goal, setPop}:{day: TDay, goal: TGoal, setPop: (content: ReactNode) =>void}){
			
}
function SingleGoal({goal, goalInfo, setPop, closePop}: {goal: TMyGoal, goalInfo: TGoal, setPop: (content: ReactNode) =>void, closePop: () => void}){
  console.log(goal)
  let goalDays =  goal.history//days.filter(day => day._id == goal._id)
  let goalProgress = goalDays.reduce((acc, day) => acc + sumDayProgress(day), 0)
  let progressWidth = 100 /goal.amount* goalProgress;
  let goalAmountString = goal.type === "time"? getTimeAmount(goalProgress) + "/" +getTimeAmount(goal.amount) + " hours": goal.type === "distance"? goalProgress/1000 + "/" + goal.amount/1000 + "km": goal.amount;
  return (
      <div className='goal' key={goal._id}>
        <div className='header'><div className='progress' style={{width: progressWidth + "%"}}></div></div>
        <div className='info'>
          <h3>{goal.title}</h3>
          <p>{goalAmountString} {goal.frequency}</p>
        </div>
        <div className='sub-progresses'>
          {goalDays.map(day =>{
        
              return (
                <div key={day._id}>
                  {
                    day.history.map(progress =>{
                      let date = new Date(progress.date);
                      return (
                        <div className='sub-progress' key={progress.date}>
                          <div className='header'>
                            <p>{sameDay(date, Date.now())? "Today" : formatDate(date)}</p>
                            <p>{getAmountString(progress.progress, goalInfo.type)}</p>

                          </div>
                        <div className='main' style={{display: "flex"}}>
                          <p>{progress.notes}</p>
                          <div className='sidebar'>
                            <MdOutlineModeEditOutline size={24} onClick={() =>setPop(<EditProgress day={day} progress={progress} closePop={closePop} />)} className='button-icon' />
                            {/* <MdDelete size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' />  */}
                          </div>
                        </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })}
        </div>
        <div className='footer'>
          <div style={{display: 'flex', gap: "5px"}}>
            <button className='outline' onClick={() => setPop(<AddProgress goal={goalInfo} dayId={goalDays.length > 0?goalDays[goalDays.length-1]._id: "fake"}  closePop={closePop}/>)}>add progress</button>
          </div>
          <div style={{display: 'flex', gap: "5px"}}>
              {/* <MdOutlineModeEditOutline size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' /> */}
              {/* <MdDelete size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' /> */}
            <button className='outline gray' onClick={() =>setPop(<EditGoal goal={goalInfo} closePop={closePop} />)} >edit</button>
            <button className='outline error' onClick={()=> setPop(<DeleteGoal goal={goalInfo} closePop={closePop} />)}>delete</button>
          </div>
        </div>
      </div>
    )
}
//* VERSION 2 */
function Goals() {
    const user = useUser();
    //const {goals } = user;
    const {goals, today, addProgress} = useDays();
    const [pop, setPop] = useState<ReactNode>();
    useEffect(()=>{
      console.log({goals})
      //worker.postMessage("hello")
    },[goals])
    //console.log(user)
  return (
    <div className='page' id='goals'>
      {pop && <Pop toggle={() => setPop(undefined)}>{pop}</Pop>}
      {/* <h1>Hello {user.name}</h1> */}
      <div className='goals'>
        {
          goals.map(goal=>{
            let {history, ...goalInfo} = goal;
            if(!goal) return <SingleGoal goal={{...goalInfo, history: []}} goalInfo={goalInfo} setPop={setPop} closePop={() => setPop(undefined)} />
            return <SingleGoal goal={goal} goalInfo={goalInfo} setPop={setPop} closePop={() => setPop(undefined)}/>
          })
        }

      </div>
      <button onClick={() =>{
        setPop(<AddGoal closePop={()=>setPop(undefined)} />)
      }}>+</button>
 
    </div>
  );
}

export default Goals;

