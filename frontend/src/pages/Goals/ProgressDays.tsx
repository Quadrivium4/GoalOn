import React,{ReactNode, useEffect, useState} from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import Pop from '../../components/Pop/Pop';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import AddGoal from '../../components/AddGoal';
import "./Goals.css"
import AddProgress from '../../components/AddProgress';
import { TMyGoal, useDays } from '../../context/DaysContext';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditGoal from '../../components/EditGoal';
import { TDay, TGoalAmountType, TGoalDays, TLike } from '../../controllers/days';
import { getTimeAmount } from '../../utils';
import EditProgress from '../../components/EditProgress';
import DeleteGoal from '../../components/DeleteGoal';
import { TGoal } from '../../controllers/goals';
import { assetsUrl, baseUrl, colors } from '../../constants';
import GoalSkeleton from '../../components/GoalSkeleton';
import Admin from '../Admin/Admin';
import { getPercentage, getProgressColor } from '../Stats/Graph';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { usePop } from '../../context/PopContext';
import { Likes } from '../../components/Likes/Likes';
import { getAmountString, getDate, getTime, isYesterday, sameDay } from './Goals';
import styles from "./ProgressDays.module.css"

export default function ProgressDays({history, setPop, onChange}:{history: TDay[], setPop: (content: ReactNode)=> void, onChange?: (day: TDay)=>void}){
    return (<div className={styles["sub-progresses"]}>
            {history.length > 0? history.sort((a, b)=> a.date -b.date).map(day =>{
            
                return (
                    <div key={day._id} className={styles.day}>
                    {/* <p>{day.utcDate.toLocaleTimeString()}</p> */}
                    <p style={{textAlign: "center"}}>{sameDay(day.date, new Date())? "Today" : isYesterday(day.date)? "Yesterday": getDate(day.date) }</p>
                    {
                        
                    day.history.sort((a, b)=> a.date -b.date).map((progress, index) =>{
                        //const strings = getDayStrings()
                        let date = new Date(progress.date);
                        return (
                            <>
                            <div className={styles["sub-progress"]} key={progress.date}>
                            <div className={styles["header"]}>
                                {/* <p>{sameDay(date, new Date())? "Today" : isYesterday(date)? "Yesterday": formatDate(date) }</p> */}
                                <p>at {getTime(date)}</p>
                                {/* {index ==0?<p >{sameDay(day.date, new Date())? "Today" : isYesterday(day.date)? "Yesterday": getDate(day.date) }</p>: null} */}
                                <p style={{color: colors.primary}}>+{getAmountString(progress.progress, day.goal.type)}</p>
                            
                            </div>
                            <div className={styles.main} style={{display: "flex"}}>
                            <p>{progress.notes}</p>
                            <div className={styles["sidebar"]}>
                                <MdOutlineModeEditOutline size={24} onClick={() =>setPop(<EditProgress day={day} progress={progress} closePop={()=>setPop(undefined)} onChange={onChange} />)} className='button-icon' />
                                {/* <MdDelete size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' />  */}
                            </div>
                            </div>
                            {progress.likes.length> 0?<div className='likes' style={{paddingBottom: 5}}>
                            <Likes likes={progress.likes}/>
                            </div>: null}
                            
                            </div>

                            </>
                        )
                        })
                    }
                    </div>
                )
                }): <p>no progress</p>}
        </div>)
}