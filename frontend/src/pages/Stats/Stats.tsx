import React, { useState } from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Calendar from './Calendar';
import Graph from './Graph';
import { useUser } from '../../context/AuthContext';
import { StatsProvider } from './StatsContext';
function Stats() {
  const user = useUser()
  return (
    <div id='stats' className='page'>
      <h1>Stats</h1>
      <StatsProvider user={user}>
        <Graph />
      </StatsProvider>
    </div>
  );
}

export default Stats;
