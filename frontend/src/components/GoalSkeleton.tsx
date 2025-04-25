import React, { useEffect, useState } from 'react';
import { useMessage } from '../context/MessageContext';
import { TGoal } from '../controllers/goals';


function GoalSkeleton({goals}:{goals: TGoal[]}) {

    return (
        <>
        {goals.map(goal =>{
            //console.log("hello")
            return (<div className="goal-skeleton" key={goal._id}>
                <div className='circle'></div>
            </div>)
        })
        }
        </>
    );
}

export default GoalSkeleton;
