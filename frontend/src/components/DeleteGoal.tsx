import { useDays } from '../context/DaysContext';
import { TGoal } from '../controllers/goals';

function DeleteGoal({closePop, goal}: {closePop: () =>void, goal: TGoal}) {
  
    const {deleteGoal} = useDays();

    const handleClick = () =>{
        deleteGoal(goal._id).then(() =>{
            closePop()
        })
    }
    return (
    <div className='form'>
        <h2>Delete Goal</h2>
        <p>Are you sure you want to delete this goal?</p>
        <button className="outline error" onClick={handleClick}>Delete</button>
    </div>
);
}

export default DeleteGoal;
