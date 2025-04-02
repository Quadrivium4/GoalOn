import { useEffect, useState} from 'react';

import { TGoal } from '../controllers/goals'; 
import {TProgress } from '../controllers/days';
import { useDays } from '../context/DaysContext';
import InputGoalValue from './Input/InputGoalValue';


function AddProgress({ goal,  closePop} : {goal: TGoal,  closePop: ()=>void}) {
    const {addProgress} = useDays()
    const [form, setForm] = useState<TProgress>({progress: 0, notes: "", likes: [], date: Date.now()});
    const updateGoalProgress = async() =>{
        console.log({form})
        addProgress(goal._id,  form.progress, form.notes, form.date).then(() =>{
            closePop();
        })
    }
    useEffect(()=>console.log("set form changed"), [setForm])
    return (
        <div className='form'>
            <h2>Add Progress</h2>
            <InputGoalValue type={goal.type} onChange={setForm}  />
            <button onClick={updateGoalProgress}>add</button>
        </div>
    );
}

export default AddProgress;
