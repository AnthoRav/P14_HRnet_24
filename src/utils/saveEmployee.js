const saveEmployee = (employee) => {
  const employees = JSON.parse(localStorage.getItem('employees')) || [];
  employees.push(employee);
  localStorage.setItem('employees', JSON.stringify(employees));
  alert('Employee Created!');
};

export default saveEmployee;