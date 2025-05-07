import React, { ReactNode, useEffect, useState } from 'react';
import { DaysProvider, TMyGoal, useDays } from '../../context/DaysContext';
import "./User.css"
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Calendar from '../Stats/Calendar';
import Graph, { getPercentage, getProgressColor } from '../Stats/Graph';
import { useLocation, useParams } from 'react-router-dom';
import { getUser } from '../../controllers/user';
import { TUser } from '../../context/AuthContext';
import { StatsProvider } from '../../context/StatsContext';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { Likes } from '../../components/Likes/Likes';
import { FriendButton } from '../Friends/SearchUser/SearchUser';
import { getDays } from '../../controllers/days';
import Goals, { getGoalAmountString,  sumDaysProgress } from '../Goals/Goals';
import GoalSkeleton from '../../components/GoalSkeleton';
import UserDays from '../Friends/UserDays/UserDays';

function User() {
    const {userId} = useParams();
    const [user, setUser] = useState<TUser>();
    const [friends, setFriends] = useState<TUser[]>();
    const [goals, setGoals] = useState<TMyGoal[]>([])
    console.log({userId})
    useEffect(() =>{
        if(userId) getUser(userId).then(res => setUser(res)).catch(err =>{
            console.log("cannot load user")
        })
        
        getDays(userId).then(setGoals).catch(err => console.log(err))
        return () =>{
        }
    },[])
    if(!user) return <p>User not found</p>;
    return (
        <div id='user' className='page'>
            <div className="header">
            <h1>Profile</h1>
        </div>
        <div className='info'>
            <ProfileIcon  name={user.name} _id={user._id} profileImg={user.profileImg} />
            <div>
                <h2>{user.name}</h2>
                {/* <p>{user.bio || "empty bio for the moment..."}</p> */}
                <p>{user.bio}</p>
                <FriendButton friend={user}/>
            </div> 
       </div>
       <div className='activities'>
        <h2>Goals</h2>
        <UserDays days={goals} />
        <h2>Stats</h2>
        <StatsProvider user={user}>
            <Graph/>
        </StatsProvider>
       </div>
        
       
        </div>
    );
}

export default User;
