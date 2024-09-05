import * as React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from "@mui/material/TextField";

import './datepicker.css'

export default function DatePickerValue({ fieldName, formData, setFormData }) {
  const [selectedDate, setSelectedDate] = React.useState(formData[fieldName] ? dayjs(formData[fieldName]) : dayjs());
  const [dateError, setDateError] = React.useState('');

  const handleDateChange = (newValue) => {
    if (validateDate(newValue)) {
      setSelectedDate(newValue);
      setFormData({
        ...formData,
        [fieldName]: newValue.format('YYYY-MM-DD') // Stocker la date dans formData avec le bon format
      });
      setDateError('');
    } else {
      setDateError('Date invalide. Veuillez sélectionner une date valide.');
    }
  };

  const validateDate = (date) => {
    // Exemple simple : La date ne peut pas être dans le futur
    return date.isBefore(dayjs());
  };

  return (
    <div >
      <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DatePicker className='datepicker'
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField 
                {...params} 
                helperText={dateError}
                error={!!dateError}
                fullWidth
                variant="outlined"
              />
            )}
          />
          
      </LocalizationProvider>
    </div>
  );
}