import { useEffect, useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { TGoal } from '../controllers/goals'; 
import { useUser } from '../context/AuthContext';
import dayController, {TProgress, TDay} from '../controllers/days';
import { useDays } from '../context/DaysContext';
import { MdDeleteOutline } from "react-icons/md";
import { colors } from '../constants';

function EditProgress({day, progress,  closePop} : {day: TDay, progress: TProgress,  closePop: ()=>void}) {
    const user = useUser();
    const {editProgress, deleteProgress} = useDays()
    const {goal} = day;
    const [progressValue, setProgressValue] = useState(progress.progress) 
    const [notes, setNotes] = useState(progress.notes);
    const updateGoalProgress = async() =>{
        console.log("update goal progress: ", {id: day._id, progressValue, goaId: goal._id})
        editProgress({id: day._id, date: progress.date,progress: progressValue, notes}).then(() =>{
             closePop();
        }).catch(err =>{
            console.log("hello error:", err)
        })
       
    }
    const deleteGoalProgress = async() =>{
        deleteProgress({...progress, id: day._id}).then(() =>{
             closePop();
        }).catch(err =>{
            console.log("hello error:", err)
        })
    }
    useEffect(() =>{
        console.log({day})
    },[])
    return (
    <div className='form'>
        <h2>Change Progress</h2>
        
        {goal.type === "time" ? <Input.TimePicker onSelect={(value) => {
            console.log("value changed", value);
            setProgressValue(value)}} initialValue={progressValue} /> 
        : goal.type === "distance"? <Input.DistancePicker onSelect={(value) => {
            console.log("value changed", value);
            setProgressValue(value)
        }} initialValue={progressValue}/> 
        : <input placeholder='progress' value={progressValue} type="number" onChange={(e)=> {
            console.log("value changed", e.target.value)
            setProgressValue(parseInt(e.target.value))
            }} />}
            <input type='text' placeholder='notes...' value={notes}onChange={(e)=> setNotes(e.target.value)}></input>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <button className="outline "onClick={updateGoalProgress}>save</button>
                <button className='outline error' onClick={deleteGoalProgress}>delete</button>
            </div>
        
    </div>
);
}

export default EditProgress;
