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
    const [selectedOption, setSelectedOption] = useState<TGoalAmountType | "">(goal.type);
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "">(goal.frequency)
    const [amount, setAmount] = useState<number>(goal.amount);
    const {addGoal, editGoal} = useDays()
    const createGoal = () =>{
        if(!title || !selectedOption || !frequency || !amount) return;
       editGoal({
            title,
            userId: user._id,
            frequency,
            amount,
            progress: 0,
            type: selectedOption
        }).then(() =>{
            closePop()
        })
    }
    return (
    <div className='form'>
        <h2>Edit Goal</h2>
        <input placeholder='title' value={title} onChange={(e)=> setTitle(e.target.value)}></input>
        <Select options={["daily", "weekly", "monthly"]} selected={goal.frequency} placeholder="frequency" onSelect={setFrequency}/>
        <Select options={["distance", "time", "other"] } selected={goal.type}placeholder='type' 
        onSelect={(option) => {
            setSelectedOption(option);
            setAmount(0);
        }
            }/>
        {selectedOption === "time"? <Input.TimePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : selectedOption === "distance"? <Input.DistancePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : <input placeholder='amount' type='number' onChange={(e)=> setAmount(parseInt(e.target.value))} value={amount || ""}></input>}
        <button onClick={createGoal}>add</button>
    </div>
);
}

export default EditGoal;
