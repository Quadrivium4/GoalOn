import React, { useEffect, useState } from 'react';
import { useDays } from '../../context/DaysContext';
import "./User.css"
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Calendar from '../Stats/Calendar';
import Graph from '../Stats/Graph';
import { useLocation, useParams } from 'react-router-dom';
import { getUser } from '../../controllers/user';
import { TUser } from '../../context/AuthContext';
import { StatsProvider } from '../../context/StatsContext';
function User() {
    const {userId} = useParams();
    const [user, setUser] = useState<TUser>();
    console.log({userId})
    useEffect(() =>{
        if(userId) getUser(userId).then(res => setUser(res)).catch(err =>{
            console.log("cannot load user")
        })
        return () =>{
        }
    },[])
    return (
        <div id='user' className='page'>
        <h1>{user?.name}</h1>
        <p>{user?.bio}</p>
        {user && 
        <StatsProvider user={user}>
            <Graph/>
        </StatsProvider>}
    
        </div>
    );
}

export default User;
