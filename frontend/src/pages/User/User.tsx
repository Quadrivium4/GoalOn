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
function User() {
    const {userId} = useParams();
    const [user, setUser] = useState<TUser>();
    console.log({userId})
    useEffect(() =>{
        if(userId) getUser(userId).then(res => setUser(res))
    },[])
    return (
        <div id='user' className='page'>
        <h1>{user?.name}</h1>
        {user && <Graph user={user}/>}
    
        </div>
    );
}

export default User;
