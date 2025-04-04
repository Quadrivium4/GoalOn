import { useState} from 'react';
import  {TProgress, TDay} from '../controllers/days';
import { useDays } from '../context/DaysContext';
import InputGoalValue from './Input/InputGoalValue';

function EditProgress({day, progress,  closePop, onChange} : {day: TDay, progress: TProgress,  closePop: ()=>void, onChange?: (day: TDay)=>void}) {
    const {editProgress, deleteProgress} = useDays()
    const {goal} = day;
    const [form, setForm] = useState<TProgress>(progress);
    const updateGoalProgress = () =>{
        editProgress({id: day._id, date: progress.date,progress: form.progress, notes: form.notes, newDate: form.date}).then((res) =>{
            if(onChange) onChange(res)
             closePop();
        }).catch(err =>{
            console.log("hello error:", err)
        })
    }
    const deleteGoalProgress = () =>{
        deleteProgress({...progress, id: day._id}).then((res) =>{
            if(onChange) onChange(res)
            closePop();
        }).catch(err =>{
            console.log("hello error:", err)
        })
    }
    return (
        <div className='form'>
            <h2>Change Progress</h2>
            <InputGoalValue type={goal.type} onChange={setForm} initial={progress} />
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <button className="outline "onClick={updateGoalProgress}>save</button>
                <button className='outline error' onClick={deleteGoalProgress}>delete</button>
            </div>
        </div>
    );
}


export default EditProgress;
