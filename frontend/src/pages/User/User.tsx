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
    const [goals, setGoals] = useState<TMyGoal[]>([]);
    const [userLoading, setUserLoading] = useState(true);
    const [goalsLoading, setGoalsLoading] = useState(true);
    console.log({userId})
    useEffect(() =>{
        setUserLoading(true)
        setGoalsLoading(true)
        if(userId) getUser(userId).then(res => {
            setUserLoading(false)
            setUser(res)
        }).catch(err =>{
            setUserLoading(false)
            console.log("cannot load user")
        })
        
        getDays(userId).then((res) =>{
            setGoals(res);
            setGoalsLoading(false);
        }
        ).catch(err => {
             setGoalsLoading(false)
            console.log(err)
        })
        return () =>{
        }
    },[])
    if(userLoading) return <p>loading...</p>
    return (
        <div id='user' className='page'>
            <div className="header">
            <h1>Profile</h1>
        </div>
        {user? <div className='info'>
            <ProfileIcon  name={user.name} _id={user._id} profileImg={user.profileImg} />
            <div>
                <h2>{user.name}</h2>
                {/* <p>{user.bio || "empty bio for the moment..."}</p> */}
                <p>{user.bio}</p>
                <FriendButton friend={user}/>
            </div> 
       </div>: <p>user not found</p>}
       <div className='activities'>
        <h2>Goals</h2>
        {goalsLoading? <p>loading</p>: <UserDays days={goals} />}
        <h2>Stats</h2>
        {user? <StatsProvider user={user}>
            <Graph/>
        </StatsProvider>: null}
       </div>
        
       
        </div>
    );
}

export default User;
