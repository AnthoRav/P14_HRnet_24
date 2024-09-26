import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import './datepicker.css'

const DatePicker = ({ fieldName, formData, setFormData, validationType }) => {
  const [selectedDate, setSelectedDate] = useState(formData[fieldName] || '');
  const [error, setError] = useState('');

// Fonction de vérification
const validateDate = (date) => {
  const currentDate = dayjs();
  const selected = dayjs(date);

  if (validationType === 'birthdate') {
    const age = currentDate.diff(selected, 'year');
    if (age < 18) {
      return `L'employé doit avoir au moins 18 ans.`;
    }
  }

  if (validationType === 'startdate' || validationType ==='birthdate') {
    if (selected.isAfter(currentDate)) {
      return "La date ne peut pas être dans le futur.";
    }
  }

  return ''; // Pas d'erreur
};

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const validationError = validateDate(newDate);

    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      setSelectedDate(newDate);
      setFormData({
        ...formData,
        [fieldName]: newDate,
      });
    }
  };

  return (
    <div className="date-picker-container">
      <input
        type="date"
        id={fieldName}
        value={selectedDate}
        onChange={handleDateChange}
        className="date-picker-input"
        aria-describedby={`${fieldName}-error`}
      />
      {error && <span id={`${fieldName}-error`} className="error-text">{error}</span>}
    </div>
  );
};

DatePicker.propTypes = {
  fieldName: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  validationType: PropTypes.oneOf(['birthdate', 'startdate']).isRequired,
};

export default DatePicker;