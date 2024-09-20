import React, { Suspense } from 'react'
//import EmployeeList from '../../components/EmployeeList/EmployeeList'
const EmployeeList = React.lazy(() => import('../../components/EmployeeList/EmployeeList'))

export default function Employee() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <div className='homepage'>
        <h2>Current Employee List</h2>
        <EmployeeList />
      </div>
    </Suspense>
  )
}
