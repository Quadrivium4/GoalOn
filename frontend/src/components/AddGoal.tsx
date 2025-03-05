import { useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { useUser } from '../context/AuthContext';
import { useDays } from '../context/DaysContext';
import { TGoalAmountType } from '../controllers/days';

function AddGoal({closePop}: {closePop: () =>void}) {
    const user = useUser();
    const [title, setTitle] = useState("")
    const [selectedOption, setSelectedOption] = useState<TGoalAmountType | "">("");
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "">("")
    const [amount, setAmount] = useState<number>();
    const {addGoal} = useDays()
    const createGoal = () =>{
        if(!title || !selectedOption || !frequency || !amount) return;
       addGoal({
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
        <h2>New Goal</h2>
        <input placeholder='title' value={title} onChange={(e)=> setTitle(e.target.value)}></input>
        <Select options={["daily", "weekly", "monthly"]}  placeholder="frequency" onSelect={setFrequency}/>
        <Select options={["distance", "time", "other"] } placeholder='type' onSelect={(option) => {
            setSelectedOption(option);
            setAmount(0);
        }
            }/>
        {selectedOption === "time"? <Input.TimePicker onSelect={setAmount}/> 
        : selectedOption === "distance"? <Input.DistancePicker onSelect={setAmount} /> 
        : <input placeholder='amount' type='number' onChange={(e)=> setAmount(parseInt(e.target.value))} value={amount || ""}></input>}
        <button onClick={createGoal}>add</button>
    </div>
);
}

export default AddGoal;
