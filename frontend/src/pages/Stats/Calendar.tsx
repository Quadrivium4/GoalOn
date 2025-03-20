import React, { useEffect, useState } from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import { TDay, TDayGoal} from '../../controllers/days';
import { TGoal } from '../../controllers/goals';
import { useUser } from '../../context/AuthContext';

const Daily = ({days, goals}:{days: TDay[], goals: TGoal[]}) =>{
    return (
        <div className='days'>
        {
          days.map(day =>{
            return (
            <div key={day._id} className='day'>
              <div className='header'>
              <p>{new Date(day.date).toDateString()}</p>
              </div>
              <div className='day-goals'>
              {/* {
                day.goals.map(goal =>{
                  let g = goals.find(g => g.id === goal.goalId);
                  let title = g?.title;
                  let dayDiveder = goal.frequency === "weekly"? 7 : goal.frequency === "monthly"? 30 : 1;
                  let progressPercentage = Math.round(100/(goal.amount/dayDiveder)* goal.progress);
                  let progressWidth = progressPercentage > 100? 100 : progressPercentage;
                  let backgroundColor = `rgb(${185-progressWidth}, ${Math.round(200/100 * progressWidth)}, ${ 82/100 * progressWidth})`
                  return (
                    <div key={goal.goalId} className='goal' >
                      <div className='progress'>
                        <div className='amount-container'>
                        <div className='amount' style={{width: progressWidth + "%", backgroundColor: backgroundColor}}></div>
                        </div>
                        <p>{ title? title + " "  +progressPercentage+ "%": null}</p>
                      </div>
                    </div>
                  )
                })

              } */}
              </div>
            </div>)
          })
        }
     </div>
    )
}
type TWeek = {
    startDate: number,
    endDate: number,
    goals: TDayGoal[]
}
const Weekly = ({weeks, goals}:{weeks: TWeek[], goals: TGoal[]}) =>{
    return (
        <div className='days'>
        {
          weeks.map(day =>{
            return (
            <div key={day.startDate} className='day'>
              <div className='header'>
              <p>{new Date(day.startDate).toDateString() } - {new Date(day.endDate).toDateString() }</p>
              </div>
              <div className='day-goals'>
              {
                day.goals.map(goal =>{
                  let g = goals.find(g => g._id === goal.goalId);
                  let title = g?.title;
                  let progressPercentage = Math.round(100/(goal.amount)* goal.progress);
                  let progressWidth = progressPercentage > 100? 100 : progressPercentage;
                  let backgroundColor = `rgb(${185-progressWidth}, ${Math.round(200/100 * progressWidth)}, ${ 82/100 * progressWidth})`
                  return (
                    <div key={goal.goalId} className='goal' >
                      <div className='progress'>
                        <div className='amount-container'>
                        <div className='amount' style={{width: progressWidth + "%", backgroundColor: backgroundColor}}></div>
                        </div>
                        <p>{ title? title + " "  +progressPercentage+ "%": null}</p>
                      </div>
                    </div>
                  )
                })

              }
              </div>
            </div>)
          })
        }
     </div>
    )
}
function Calendar({frequency}:{frequency: "daily" | "weekly" | "monthly"}) {
  // const user = useUser();
  // const {days} = useDays();
  // const [weeks, setWeeks] = useState<TWeek[]>([]);
  // const {goals} = user
  // useEffect(() =>{
  //   let w = [];
  //   let weeksArray: TWeek[] = []
  //   for(let i = 0; i<days.length; i++){
  //       if(!w[Math.floor(i/7)]){
  //           w[Math.floor(i/7)] = [days[i]]
  //       }else {
  //           w[Math.floor(i/7)].push(days[i])
  //       }
        
  //   }
  //   console.log(w)
  //   w.map(week =>{
  //       console.log({week})
  //       let weekResume: TWeek = {
  //           startDate: week[0].date,
  //           endDate: week[week.length-1].date,
  //           goals: []
  //       }
  //       week.map(day =>{
  //           // day.goals.map((goal, i)=>{
  //           //     if(!weekResume.goals[i]){
  //           //         weekResume.goals[i] = {
  //           //         goalId: goal.goalId,
  //           //         amount: goal.frequency === "daily"? goal.amount * 7 : goal.frequency === "weekly"? goal.amount : goal.amount/4.5,
  //           //         type: goal.type,
  //           //         progress: goal.progress,
  //           //         frequency: goal.frequency
  //           //     }
  //           //     }else{
  //           //         weekResume.goals[i].progress +=goal.progress
  //           //     }
                
  //           // })
  //       })
  //       weeksArray.push(weekResume);
  //   })
  //   console.log({weeksArray})
  //   setWeeks(weeksArray)
  // },[days])
  // return (
  //     frequency === "daily"? <Daily days={days} goals={goals} />: frequency === "weekly"? <Weekly weeks={weeks} goals={goals}></Weekly>: null
  // );
  return (<></>)
}

export default Calendar;
