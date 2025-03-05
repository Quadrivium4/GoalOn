import { useEffect, useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { TGoal } from '../controllers/goals'; 
import { useUser } from '../context/AuthContext';
import { TDay } from '../controllers/days';
import { useDays } from '../context/DaysContext';
import DatePicker from './DatePicker';

function getDateInputValue(date: number | Date){
    date = new Date(date);
    let year = date.getFullYear();
    let month = date.getMonth();
    let result = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${date.getDate().toString().padStart(2,"0")}`;
    return result;
}
function getTimeInputValue(date: number | Date){
    date = new Date(date);
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let result = `${hours}:${minutes}`;
    return result;
}
function yearMonthFromValue(date: string){
    let year = parseInt(date.split("-")[0]);
    let month = parseInt(date.split("-")[1]);
    let day = parseInt(date.split("-")[2]);
    return {year, month, day}
}
function timeFromValue(time: string){
    let hours = parseInt(time.split(":")[0]);
    let minutes = parseInt(time.split(":")[1]);
    return {hours, minutes}

}
function AddProgress({dayId, goal,  closePop} : {dayId: string, goal: TGoal,  closePop: ()=>void}) {
    console.log(dayId)
    const {addProgress} = useDays()
    const [progressValue, setProgressValue] = useState(0) 
    const [date, setDate] = useState(new Date())
    const [notes, setNotes] = useState("");
    const updateGoalProgress = async() =>{
        //console.log({day})
        console.log("update goal progress: ", {id: dayId, progressValue, goaId: goal._id})
        addProgress(goal._id,  progressValue, notes).then(() =>{
             closePop();
        })
       
    }
    const updateDate = (dateString: string) =>{
        console.log({dateString})
        if(dateString == '') return;
        let {year, month, day} = yearMonthFromValue(dateString);
        console.log({year, month})
        let newDate = new Date(date);
        newDate.setFullYear(year, month, day);
        setDate(newDate)
    }
    const updateTime = (dateString: string) =>{
        if(dateString == '') return;
        let {hours, minutes} = timeFromValue(dateString)
        let newDate = new Date(date);
        newDate.setHours(hours, minutes);
        setDate(newDate)
    }
    useEffect(() =>{
        console.log("date changed")
    }, [date])
    return (
    <div className='form'>
        <h2>Add Progress</h2>
        <div style={{display: "flex", flexDirection: "row", width: '100%', justifyContent:"space-between", gap: 5}}>
            <input type="date" placeholder='date' value={getDateInputValue(date)} style={{display: 'flex', width: "100%"}} onChange={(e) => updateDate(e.target.value)}></input>
            <input type="time" placeholder='time' value={getTimeInputValue(date)} style={{display: 'flex', width: "50%"}} onChange={(e) => updateTime(e.target.value)}></input>
        </div>
        
        {/* <DatePicker setDate={(date) =>console.log(date)} /> */}
        {goal.type === "time" ? <Input.TimePicker onSelect={(value) => {
            console.log("value changed", value);
            setProgressValue(value)}} /> 
        : goal.type === "distance"? <Input.DistancePicker onSelect={(value) => {
            console.log("value changed", value);
            setProgressValue(value)
        }}/> 
        : <input placeholder='progress' value={progressValue} type="number" onChange={(e)=> {
            console.log("value changed", e.target.value)
            setProgressValue(parseInt(e.target.value))
            }} />}
            <input type='text' placeholder='notes...' onChange={(e)=> setNotes(e.target.value)}></input>
        <button onClick={updateGoalProgress}>add</button>
    </div>
);
}

export default AddProgress;
