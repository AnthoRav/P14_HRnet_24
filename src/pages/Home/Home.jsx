import React, { useState } from 'react';
//import HorizontalLinearStepper from '../../components/Stepper/Stepper';
import CreateEmployee from '../../components/CreateEmployee/CreateEmployee';

import './home.css'

export default function Home() {
  // const [activeStep, setActiveStep] = useState(0);

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const handleFormSubmit = (formData) => {
    // Vous pouvez gérer les données du formulaire ici
    console.log('Form Data:', formData);
    //handleNext();
  };
  return (
    <div className='homepage'>
      <h2>Create Employee</h2>
      {/* <HorizontalLinearStepper activeStep={activeStep} /> */}
      <CreateEmployee  onFormSubmit={handleFormSubmit} />
    </div>
  )
}
