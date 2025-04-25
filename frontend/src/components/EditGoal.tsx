import { useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { useUser } from '../context/AuthContext';
import { useDays } from '../context/DaysContext';
import { TGoal } from '../controllers/goals';
import { TGoalAmountType } from '../controllers/days';

function EditGoal({closePop, goal}: {closePop: () =>void, goal: TGoal}) {
    const user = useUser();
    const [title, setTitle] = useState(goal.title)
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "">(goal.frequency)
    const [amount, setAmount] = useState<number>(goal.amount);
    const { editGoal} = useDays()
    const createGoal = () =>{
        if(!title|| !frequency || !amount) return;
       editGoal({
            title,
            userId: user._id,
            frequency,
            amount,
            progress: 0,
            _id: goal._id
        }).then(() =>{
            closePop()
        })
    }
    
    return (
    <div className='form'>
        <h2>Edit Goal</h2>
        <input placeholder='title' value={title} onChange={(e)=> setTitle(e.target.value)}></input>
        <Select options={["daily", "weekly", "monthly"]} selected={goal.frequency} placeholder="frequency" onSelect={setFrequency}/>

        {goal.type === "time"? <Input.TimePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : goal.type=== "distance"? <Input.DistancePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : <input placeholder='amount' type='number' onChange={(e)=> setAmount(parseInt(e.target.value))} value={amount || ""}></input>}
        <button onClick={createGoal}>save</button>
    </div>
);
}

export default EditGoal;
