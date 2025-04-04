import {  useState } from "react";
import { TGoalAmountType, TProgress } from "../../controllers/days";
import Input from "./Input";
import { useMessage } from "../../context/MessageContext";

export function getDateInputValue(date: number | Date){
    date = new Date(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let result = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${date.getDate().toString().padStart(2,"0")}`;
    //console.log(result, date)
    return result;
}
export function getTimeInputValue(date: number | Date){
    //console.log({date})
    date = new Date(date);
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let result = `${hours}:${minutes}`;
    return result;
}
export function yearMonthFromValue(date: string){
    let year = parseInt(date.split("-")[0]);
    let month = parseInt(date.split("-")[1]) - 1;
    let day = parseInt(date.split("-")[2]);
    return {year, month, day}
}
export function timeFromValue(time: string){
    let hours = parseInt(time.split(":")[0]);
    let minutes = parseInt(time.split(":")[1]);
    return {hours, minutes}

}
const emptyProgress: TProgress = {date: Date.now(), notes: "", progress: 0, likes: []};

function InputProgressValues({type, onChange, initial }: {type:TGoalAmountType, onChange: (form: TProgress)=>void, initial?: Partial<TProgress>}){
    const {message} = useMessage();
    const [form, setForm] = useState<TProgress>({...emptyProgress, ...initial});
    const updateForm = (form: TProgress) =>{
        setForm(form);
        onChange(form);
    }
    const updateDate = (dateString: string) =>{
            console.log({dateString})
            if(dateString === '') return;
            let {year, month, day} = yearMonthFromValue(dateString);
            console.log({year, month})
            let newDate = new Date(form.date);
            newDate.setFullYear(year, month, day);
            if(newDate.getTime() > Date.now()) return message.error("Invalid date in the future");
            updateForm({...form, date: newDate.getTime()})
        }
    const updateTime = (dateString: string) =>{
        if(dateString === '') return;
        let {hours, minutes} = timeFromValue(dateString)
        let newDate = new Date(form.date);
        newDate.setHours(hours, minutes);
        if(newDate.getTime() > Date.now()) return message.error("Invalid date in the future");
        updateForm({...form, date: newDate.getTime()})
    }
    const updateProgress = (value: number) => {
        updateForm({...form, progress: value});
    }
    const updateNotes = (value: string) => updateForm({...form, notes: value})
    return (
        <>
        <div style={{display: "flex", flexDirection: "row", width: '100%', justifyContent:"space-between", gap: 5}}>
            <input type="date" placeholder='date' value={getDateInputValue(form.date)} style={{display: 'flex', width: "100%"}} onChange={(e) => updateDate(e.target.value)}></input>
            <input type="time" placeholder='time' value={getTimeInputValue(form.date)} style={{display: 'flex', width: "50%"}} onChange={(e) => updateTime(e.target.value)}></input>
        </div>
        {type === "time" ? <Input.TimePicker onSelect={(value) => updateProgress(value)} initialValue={form.progress}/> 
        : type === "distance"? <Input.DistancePicker onSelect={updateProgress} initialValue={form.progress}/> 
        : <input placeholder='progress' value={form.progress} type="number" onChange={(e)=> updateProgress(parseInt(e.target.value))} />}
            <input type='text' placeholder='notes...' value={form.notes}onChange={(e)=> updateNotes(e.target.value)}></input>
            </>
    )
}
export default InputProgressValues