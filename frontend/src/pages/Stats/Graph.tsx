
import React,{useEffect, useState, useRef, ReactNode} from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import { getLastMonday, getNormalizedPercentage } from '../../utils';
import dayController, { TGoalDays, TStat } from '../../controllers/days';
import {  TDay, TDayGoal, TProgress, TStats } from '../../controllers/days';
import { TUser, useUser } from '../../context/AuthContext';
import Pop from '../../components/Pop/Pop';
import { editGoalAmount, TGoal, TGoalForm } from '../../controllers/goals';
import { formatDate, getAmountString, getGoalAmountString, ProgressDays, SingleGoal, sumDayProgress, sumDaysProgress } from '../Goals/Goals';
import { Day, Goal } from '../Friends/Friends';
import AddProgress from '../../components/AddProgress';
import EditProgress from '../../components/EditProgress';
import { useStats } from '../../context/StatsContext';
import EditGoal from '../../components/EditGoal';
import Input from '../../components/Input/Input';
type TPoint = {
    x: number,
    y: number
}

type TGraphPoint = {
    id: string,
    amountHeight: number,
    progress: number,
    color: string,
    date: Date,
    gradientId: string,
    history: TDay[],
    goal: TGoal
} & TPoint;
type TDayPoint =TDay & {

}
type TMonthPoint = {
    id: string,
    name: string
} &TPoint;
// const gap = 25;
// const padding = 10;
const gap = 25;
const rectWidth =gap/2;
const paddingVertical = 10;
const paddingHorizontal = 40;
const minSvgWidth = 0;

export const getPercentage = (amount: number, progress: number) =>{
    let percentage = Math.round(100/(amount)* progress);
    //percentage = percentage > 100 ? 100 : percentage;
    return percentage;
}
export const normalizePercentage = (percentage: number) =>{
    percentage = percentage > 100 ? 100 : percentage;
    return percentage
}
export const getProgressColor = (percentage: number) =>{
    return `rgb(${185-percentage}, ${Math.round(200/100 * percentage)}, ${ Math.round(82/100 * percentage)})`;
}
function getCalendarDates(from: number, to: number, option?: "daily" | "weekly"){
    let startDate = new Date(from);
    const endDate = new Date(to);
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    const dateArrays = [];
    if(!option || option === "daily"){
        for(; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)){
            dateArrays.push(new Date(startDate));
        }
    }else if(option === "weekly"){
        startDate = getLastMonday(startDate);
        for(; startDate <= endDate; startDate.setDate(startDate.getDate() + 7)){
            dateArrays.push(new Date(startDate));
        }
    }
    
    //dateArrays.push(new Date(startDate));
    //console.log(dateArrays);
    return dateArrays;
}
function createPolygonStringAndMonthPoints (graph: TGraphPoint[]) {
    let str = "";
    let monthPointsArray:TMonthPoint[]= [];
    for(let i = 0; i < graph.length; i++){
        let point = graph[i];
        str += `${point.x},${point.y} `;
        let day = new Date(graph[i].date);
        let previousDay = new Date(graph[i-1]?.date);
        if(day.getMonth() != previousDay.getMonth() ){
            monthPointsArray.push({...point, name: point.date.toLocaleString('en-us', { month: 'long' }), id: "month" + point.date.getTime()});
        }
    }
    str+=`${graph[graph.length-1].x},150 ${graph[0].x},150`;
    return {
        monthPoints: monthPointsArray,
        polygonString: str
    }
}
export function createGraphPoint(goal: TGoal, history: TDay[], date: Date, i: number, frequency: TGoal["frequency"], maxAmount?: number, ): TGraphPoint{
    if(!maxAmount)  maxAmount  = 0;

    let goalProgress = sumDaysProgress(history)

    let progressHeight = getPercentage(maxAmount, goalProgress);
    
    //let maxAmount = (100 *sumDaysProgress(newHistory))/  (150 - point.amountHeight);
    let progressPercentage = normalizePercentage(getPercentage(goal.amount, goalProgress));
    let amountHeight = getPercentage(maxAmount, goal.amount);
    let color = getProgressColor(progressPercentage)
    //let dayNumber = date.getDate().toString()
    let id = goal._id + date.getTime();
    let gradientId = "gradient" +  id;
    
    return {
        id,
        progress: progressHeight,
        date: date,
        color,
        gradientId,
        history,
        goal: {
            ...goal,
            frequency
        },
        x: i * gap + paddingHorizontal,
        y: 150 - progressHeight,
        amountHeight: 150 - amountHeight
        //Oppure 150 - progress + padding???
    }

}
type TDateDays = {
    date: Date, 
    days: TDay[]
}
export function getDaysArray(frequency: TGoal["frequency"], calendar: Date[], stats: TDay[]):TDateDays[]{
    let daysArray: TDateDays[] = [];
    let j = 0;
    calendar.map((date, i) =>{
        let day = stats[j];
        //if(!day) return daysArray.push({date, days: []});
        if(frequency=== "weekly"){
            if(day) {
                let history = [];
                while(stats[j ]&& date.getTime()  + 7 * 24 *60 * 60 * 1000 > stats[j].date){
                    day = stats[j]
                    history.push(day)
                    j++;
                    
                }
                daysArray.push({date, days: history})
            } else daysArray.push({date, days: []})
        }else if(frequency === "daily"){
            //console.log()
           //console.log(day, date.toDateString(), new Date(day.date).toDateString(), j)
            if(day&& date.toDateString() === new Date(day.date).toDateString()){
                daysArray.push({date, days: [day]})
                j++;
            }else daysArray.push({date, days: []})
            //console.log( j)
        }
    })
    return daysArray;
}
export function getMaxProgress(stats: TDateDays[], frequency: TGoalForm["frequency"]){
    let maxAmount = sumDaysProgress(stats[0].days);
        for(const {days, date} of stats){
            const curAmount = sumDaysProgress(days);
            const latestDay = days[days.length-1];
            if(latestDay && latestDay.goal.amount > maxAmount) maxAmount = latestDay.goal.amount;
            if(curAmount > maxAmount) maxAmount = curAmount;
        }
    
    return maxAmount;
}
export function createEmptyPoint(goal: TGoal, date: Date, i: number, frequency: TGoal["frequency"],  maxAmount: number ) {
    let id = goal._id + date.getTime();
    let point: TGraphPoint =  {
        id,
        color: getProgressColor(0), 
        date: date, 
        gradientId: "gradient" + id, 
        progress: 0,
        x: i *gap +paddingHorizontal,
        y:  150, 
        history: [], 
        goal: {
            ...goal,
            frequency
        }, 
        amountHeight: 150- getPercentage(maxAmount, goal.amount)
        };
    return point;
}
export function createGraphArray(stats: TDay[], goal: TGoal):TGraphPoint[] {
    if(stats.length < 1) return [];

    let firstDay = stats[0];
    let graphsArray:TGraphPoint[] = [];
    
    let today = new Date();//new Date("2024, 12, 25")
    
    let option: "daily" | "weekly" = goal.frequency === "daily"? "daily" : "weekly";
    let calendar = getCalendarDates(firstDay.date, today.getTime(),option );
    //console.log({calendar})
    
    let daysArray: TDateDays[] = getDaysArray(goal.frequency, calendar, stats);
     //console.log({daysArray})
    let maxProgress = getMaxProgress(daysArray, goal.frequency);
    // empty days use latest goal amount
    let dayLatestGoal = daysArray[0].days[daysArray[0].days.length-1].goal;
    //console.log(goal.title, {maxProgress})
    daysArray.map(({date, days}, i) =>{
        let point: TGraphPoint;
        if(days.length > 0){
            dayLatestGoal = days[days.length-1].goal;
            point = createGraphPoint(dayLatestGoal, days, date, i,goal.frequency, maxProgress);
            
        }else point = createEmptyPoint(dayLatestGoal, date, i, goal.frequency, maxProgress)
        
        graphsArray.push(point)
    })

    return graphsArray
}
function EditGoalAmount({goal, closePop, date}: {goal: TGoal, closePop: ()=>void, date: number}){
    const user = useUser();
    const {updateStats} = useStats();
    const [amount, setAmount] = useState<number>(goal.amount);
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
    const createGoal = () =>{
        if(!amount) return;
       editGoalAmount({
            title: goal.title,
            userId: user._id,
            frequency: goal.frequency,
            amount,
            progress: 0,
            _id: goal._id
        },date ).then((res) =>{
            closePop();
            updateStats(res)
        }).catch(err=>{
            console.log("error edit amount stats")
        })
    }
    
    return (
    <div className='form'>
        <h2>Edit Goal Amount</h2>
        {goal.type === "time"? <Input.TimePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : goal.type=== "distance"? <Input.DistancePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : <input placeholder='amount' type='number' onChange={(e)=> setAmount(parseInt(e.target.value))} value={amount || ""}></input>}
        <button onClick={createGoal}>save</button>
    </div>)
}

function PointPop ({point, setPop}: {point: TGraphPoint, setPop: (pop: ReactNode) =>void}){
    const {updateStats, reloadStats} = useStats()
    const date = new Date(point.date);
    const now = new Date()
    date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    let goalDays =  point.history;
    let {goal } = point;
    let goalProgress = sumDaysProgress(goalDays);
    let progressWidth = normalizePercentage(getPercentage(goal.amount, goalProgress));
    let goalAmountString = getGoalAmountString(goal, goalProgress)
    return (
        <div className='point-pop'> 
            <div className='info'>
                <p>{goalAmountString} {goal.frequency}</p>
            </div>
            <div className='header'><div className='progress' style={{width: progressWidth + "%",backgroundColor: getProgressColor(progressWidth)}}></div></div>
            
            
            <ProgressDays history={point.history} setPop={setPop} onChange={reloadStats}/>
            <button className='outline' onClick={() => setPop(<AddProgress goal={point.goal}  closePop={()=>setPop(undefined)} date={date.getTime()} onRes={reloadStats}/>)}>add progress</button>
            <button className='outline gray' onClick={() => setPop(<EditGoalAmount goal={point.goal}  date={point.date.getTime()} closePop={() => setPop(undefined)}/>)}>Edit goal</button>
        </div>
    )

}

function Svg ({graph}:{graph: TGraphPoint[]}) {
    const [pointsString, setPointsString] = useState("");
    const [monthNamePoints, setMonthNamePoints] = useState<TMonthPoint[]>([]);
    const [monthDayScroll, setMonthDayScroll] = useState(0);
    const [pop, setPop] = useState<ReactNode>();
    const ref = useRef<HTMLDivElement>(null);
    const svgWidth = (graph.length -1) * gap + paddingHorizontal * 2 < minSvgWidth? minSvgWidth : (graph.length -1) * gap + paddingHorizontal * 2 ;
   // console.log({svgWidth, length: graph.length, gap})
    useEffect(() =>{
        
        let {polygonString, monthPoints} = createPolygonStringAndMonthPoints(graph)
        setMonthNamePoints(monthPoints);
        setPointsString(polygonString)
        if(ref.current) {
            //console.log({div: ref.current})
            ref.current.scrollLeft = ref.current.scrollWidth
        }
    },[graph])
    return (
        <>
        {/* PROBLEMA!! MESI UNO ATTACCATO ALL'ALTRo */}
         <div className='months'>
            {
                monthNamePoints.map((month, i) =>{
                    let nextMonthPosition = monthNamePoints[i+1]?  monthNamePoints[i+1].x : svgWidth//graph.length *gap+ padding;
                    let visible = monthDayScroll > month.x - (paddingHorizontal + 0.1);
                    return <p key={month.id}className='month' style={{opacity: (nextMonthPosition - monthDayScroll - paddingHorizontal)/130, display: visible? "block" : "none", paddingLeft: paddingHorizontal}} >{month.name}</p>
                })
            }
        </div>
        <div className='graph' ref={ref} onScroll={(e)=>{
            let scroll = e.currentTarget.scrollLeft;
            if(Math.abs(scroll - monthDayScroll) >0) setMonthDayScroll(scroll)
        }} style={{maxWidth: svgWidth}}>
            <svg width={svgWidth} height={150 + paddingVertical}>
                <polygon points={pointsString} fill='rgba(92, 200, 82, 0.25)'></polygon>
                {graph.map((point, i) =>{
                    let nextPoint = graph[i+1];
                    //console.log({point})
                    return (

                        <g onClick={() =>{ setPop(<PointPop point={point} setPop={setPop} />)}} key={point.id}>
                        <rect x={point.x - gap/2} width={gap} height={150} fillOpacity={0}></rect>

                        <circle r={3} cx={point.x} cy={point.amountHeight}z={10} fill={"white"} ></circle>
                        {nextPoint && <line x1={point.x} x2={ nextPoint.x} y1={point.amountHeight} y2={nextPoint.amountHeight} style={{stroke:  "rgba(230, 230, 230, 0.5)"}}  ></line>}

                        <line x1={point.x} x2={point.x} y1={50} y2={150}  className='line-vertical'></line>
                        <circle r={5} cx={point.x} cy={point.y}z={10} fill={point.color} key={i} ></circle>

                        
                        <text x={point.x - (4.5 * point.date.getDate().toString().length)} y={40} style={{color: "red"}}>{point.date.getDate().toString() }</text>
                            {nextPoint? 
                            <>
                            <linearGradient id={point.gradientId} >
                                <stop offset="0%" stopColor={point.color}></stop>
                                <stop offset="100%" stopColor={nextPoint.color}></stop>
                            </linearGradient>
                            <line x1={point.x} y1={point.y} x2={nextPoint.x}y2={nextPoint.y} className='line-connect' stroke={point.color == nextPoint.color? nextPoint.color : `url(#${point.gradientId})` }></line>
                            </>
                        : null}
                        </g>
                    )
                })}
            {
                monthNamePoints.map(
                    (month) =>(monthDayScroll < month.x - paddingHorizontal && <text key={month.id}className='month'  x={month.x } y={20}>{month.name}</text>)
                )
            }
            </svg>
            
        </div>
        {pop && <Pop toggle={() => setPop(undefined)}>{pop}</Pop>}
        </>
    )
}

export type TGraph = {
    goal: TGoal,
    points: TGraphPoint[]
}
function Graph() {
    const {stats} = useStats()
    return (
        <div className='graphs'>
            {stats.map((graph, i)=>{
                //if(i == 0) console.log("RERENDER")
                let {points, goal} = graph;
                if(points.length < 1) return <p>no stats</p>
                return (
                    <div key={goal._id} className='graph-container'>
                        <h3>{goal.title}</h3>
                        <Svg graph={points} />
                    </div>
                )
            })}
        </div>
    );
}

export default Graph;
