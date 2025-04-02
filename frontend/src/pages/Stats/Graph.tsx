
import React,{useEffect, useState, useRef, ReactNode} from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import { getNormalizedPercentage } from '../../utils';
import dayController, { TGoalDays, TStat } from '../../controllers/days';
import {  TDay, TDayGoal, TProgress, TStats } from '../../controllers/days';
import { TUser, useUser } from '../../context/AuthContext';
import Pop from '../../components/Pop/Pop';
import { TGoal } from '../../controllers/goals';
import { formatDate, ProgressDays, SingleGoal, sumDayProgress, sumDaysProgress } from '../Goals/Goals';
import { Day, Goal } from '../Friends/Friends';
import AddProgress from '../../components/AddProgress';
import EditProgress from '../../components/EditProgress';
type TPoint = {
    x: number,
    y: number
}

type TGraphPoint = {

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
    percentage = percentage > 100 ? 100 : percentage;
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
    const startDate = new Date(from);
    const endDate = new Date(to);
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    const dateArrays = [];
    if(!option || option == "daily"){
        for(; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)){
            dateArrays.push(new Date(startDate));
        }
    }else{
        for(; startDate < endDate; startDate.setDate(startDate.getDate() + 7)){
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
            monthPointsArray.push({...point, name: point.date.toLocaleString('en-us', { month: 'long' })});
        }
    }
    str+=`${graph[graph.length-1].x},150 ${graph[0].x},150`;
    return {
        monthPoints: monthPointsArray,
        polygonString: str
    }
}
function createGraphPoint(goal: TGoal, history: TDay[], date: number, i: number): TGraphPoint{
    let goalProgress = sumDaysProgress(history)
    let progress = normalizePercentage(getPercentage(goal.amount, goalProgress));
    let color = getProgressColor(progress)
    //let dayNumber = date.getDate().toString()
    let gradientId = "gradient" + Math.random();
    return {
        progress,
        date: new Date(date),
        color,
        gradientId,
        history,
        goal: goal,
        x: i * gap + paddingHorizontal,
        y: 150 - progress 
        //Oppure 150 - progress + padding???
    }

}
function createGraphArray(stats: TDay[], goal: TGoal):TGraphPoint[] {
    let graphsArray:TGraphPoint[] = []
    let today = new Date();//new Date("2024, 12, 25")
    let firstDay = stats[0];
    if(!firstDay) return [];
    let option: "daily" | "weekly" = stats[0].goal.frequency === "daily"? "daily" : "weekly";
    let calendar = getCalendarDates(stats[0].date, today.getTime(),option );
    let j = 0;
    calendar.map((date, i) =>{
        let day = stats[j];
        if(goal.frequency=== "weekly"){
            if(day) {
                let history = [];
                while(day&& date.getTime()  + 7 * 24 *60 * 60 * 1000 > day.date){
                    history.push(day)
                    j++;
                    day = stats[j]
                }
                let point = createGraphPoint(goal,history, date.getTime(), i);
                graphsArray.push(point)
            } else{
                let point: TGraphPoint = {color: getProgressColor(0), date: date, gradientId: "fake", progress: 0,x: i *gap +paddingHorizontal, y:  150, history: [], goal: goal}
                graphsArray.push(point)
            }
        }else {
            
             if(day&& date.toDateString() == new Date(day.date).toDateString()){
                //console.log(date.toDateString(), day.date, new Date(day.date).toDateString(), day.history);
                let point: TGraphPoint = createGraphPoint(goal, [day], date.getTime(), i);
                //console.log(day)
                graphsArray.push(point)
                j++;
            }else{
                let point: TGraphPoint = {color: getProgressColor(0), date: date, gradientId: "fake", progress: 0,x: i *gap + paddingHorizontal, y:  150, history: [], goal: goal}
                graphsArray.push(point)
            }
        }
       
    })
    return graphsArray
}
function PointPop ({point, setPop}: {point: TGraphPoint, setPop: (pop: ReactNode) =>void}){
    return (
        <>
            <ProgressDays history={point.history} setPop={setPop} />
            <button className='outline' onClick={() => setPop(<AddProgress goal={point.goal}  closePop={()=>setPop(undefined)}/>)}>add progress</button>
        </>
    )

}

function Svg ({graph}:{graph: TGraphPoint[]}) {
    const [pointsString, setPointsString] = useState("");
    const [monthNamePoints, setMonthNamePoints] = useState<TMonthPoint[]>([]);
    const [monthDayScroll, setMonthDayScroll] = useState(0);
    const [pop, setPop] = useState<ReactNode>();
    const ref = useRef<HTMLDivElement>(null);
    const svgWidth = (graph.length -1) * gap + paddingHorizontal * 2 < minSvgWidth? minSvgWidth : (graph.length -1) * gap + paddingHorizontal * 2 ;
    console.log({svgWidth, length: graph.length, gap})
    useEffect(() =>{
        let {polygonString, monthPoints} = createPolygonStringAndMonthPoints(graph)
        setMonthNamePoints(monthPoints);
        setPointsString(polygonString)
        if(ref.current) {
            console.log({div: ref.current})
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
                    return <p className='month' style={{opacity: (nextMonthPosition - monthDayScroll - paddingHorizontal)/130, display: visible? "block" : "none", paddingLeft: paddingHorizontal}} >{month.name}</p>
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
                        <>
                        <label htmlFor="hello"></label>
                        <g onClick={() =>{ setPop(<PointPop point={point} setPop={setPop} />)}} >
                        <rect x={point.x - gap/2} width={gap} height={150} fillOpacity={0}></rect>
                        <line x1={point.x} x2={point.x} y1={50} y2={150}  className='line-vertical'></line>
                        <circle r={5} cx={point.x} cy={point.y}z={10} fill={point.color} key={i} ></circle>
                        <text x={point.x - (4.5 * point.date.getDate().toString().length)} y={40} style={{color: "red"}}>{point.date.getDate().toString() }</text>
                        
                        </g>
                        {nextPoint? 
                            <>
                            <linearGradient id={point.gradientId} >
                                <stop offset="0%" stopColor={point.color}></stop>
                                <stop offset="100%" stopColor={nextPoint.color}></stop>
                            </linearGradient>
                            <line x1={point.x} y1={point.y} x2={nextPoint.x}y2={nextPoint.y} className='line-connect' stroke={point.color == nextPoint.color? nextPoint.color : `url(#${point.gradientId})` }></line>
                            </>
                        : null}
                       

                        </>
                    )
                })}
            {
                monthNamePoints.map(
                    (month) =>(monthDayScroll < month.x - paddingHorizontal && <text className='month'  x={month.x } y={20}>{month.name}</text>)
                )
            }
            </svg>
            
        </div>
        {pop && <Pop toggle={() => setPop(undefined)}>{pop}</Pop>}
        </>
    )
}

type TGraph = {
    title: string, 
    graph: TGraphPoint[]
}
function Graph({user}: {user: TUser}) {
    //const {days} = useDays();

    // DA FARE GOAL RELATIVI ALLO USER PRESO IN CONSIDERAZIONE
    const {goals} = user;
    const [stats, setStats] = useState<TGoalDays[]>([]);
    const [graphs, setGraphs] = useState<TGraph[]>([]);

    useEffect(()=>{
            dayController.getStats(user._id).then(data =>{
                setStats(data)
            });
       
    },[])
    useEffect(() =>{
        let graphsArray: TGraph[]  = stats.map((stat)=>{
            let {days, ...goal} = stat;

            return {
                title: stat.title,
                graph: createGraphArray(days,goal )
            }
        })
        setGraphs(graphsArray)
    },[goals, stats])
    
    return (
        <div className='graphs'>
            {graphs.map((graph, i)=>{
                if(graph.graph.length < 1) return <p>no stats</p>
                let title = graph.title
                return (
                    <div key={stats[i]._id} className='graph-container'>
                        <h3>{title}</h3>
                        <Svg graph={graph.graph} />
                    </div>
                )
            })}
        </div>
    );
}

export default Graph;
