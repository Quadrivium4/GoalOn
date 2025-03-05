import { useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { useUser } from '../context/AuthContext';
import { useDays } from '../context/DaysContext';
import { TGoal } from '../controllers/goals';
import { TGoalAmountType } from '../controllers/days';

function DatePicker({setDate}: {setDate: (date: Date) => void}) {

    return (
    <div className='date-picker'>
        <input type="date"></input>
        <input type="time"></input>
    </div>
);
}

export default DatePicker;
