import React, { useEffect, useState } from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Calendar from './Calendar';
import Graph from './Graph';
import { useUser } from '../../context/AuthContext';
import { StatsProvider } from '../../context/StatsContext';
function Stats() {
  const user = useUser()
  useEffect(()=>{
    //console.log("stats rerender")
  },[])
  return (
    <div id='stats' className='page'>
      <h1>Stats</h1>

        <Graph />
    </div>
  );
}

export default Stats;
