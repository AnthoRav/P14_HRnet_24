import React from 'react';
import CreateEmployee from '../../components/CreateEmployee/CreateEmployee';

import './home.css'

export default function Home() {
  
  
  return (
    <div className='homepage'>
      <h2>Create Employee</h2>
      <CreateEmployee />
    </div>
  )
}
