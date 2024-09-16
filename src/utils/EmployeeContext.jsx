import React, { createContext, useState } from 'react';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  const addEmployee = (employee) => {
    console.log('Ajout de l\'employé :', employee);
    setEmployees([...employees, employee]);
  };

  const removeEmployee = (employeeIndex) => {
    setEmployees(employees.filter((_, index) => index !== employeeIndex));
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, removeEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};