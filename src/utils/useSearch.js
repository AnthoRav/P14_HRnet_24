import { useState, useEffect } from 'react';

export const useSearch = (data, searchTerm) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredEmployees = data.filter((employee) =>
        employee.firstName.toLowerCase().includes(lowercasedFilter) ||
        employee.lastName.toLowerCase().includes(lowercasedFilter)  ||
        employee.dateOfBirth.toLowerCase().includes(lowercasedFilter) ||
        employee.street.toLowerCase().includes(lowercasedFilter)  ||
        employee.city.toLowerCase().includes(lowercasedFilter) ||
        employee.state.toLowerCase().includes(lowercasedFilter) ||
        employee.department.toLowerCase().includes(lowercasedFilter)  ||
        employee.zipCode.toLowerCase().includes(lowercasedFilter)  ||
        employee.startDate.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredData(filteredEmployees);
    }
  }, [searchTerm, data]);

  return filteredData;
};