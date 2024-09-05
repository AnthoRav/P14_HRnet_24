import React, { useState, useEffect, useContext } from 'react';
import { MobileStepper, Button, Typography } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import Dropdown from '../DropDown/DropDown';
import DatePickerValue from '../DatePicker/DatePicker';
import { departments } from '../../data/departments';
import { states } from '../../data/states';
import { EmployeeContext } from '../../utils/EmployeeContext';
import SuccessModal from '../Modal/Modal';

import "./createemployee.css";

const steps = [
  'Informations personnelles',
  'Adresse',
  'Informations sur l\'entreprise'
];

const CreateEmployee = ({ onFormSubmit }) => {

  const { addEmployee } = useContext(EmployeeContext);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: '',
    startDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isFieldChecked, setIsFieldChecked] = useState({});
  const [isStepValid, setIsStepValid] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const regexPatterns = {
    firstName: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
    lastName: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
    street: /^.{1,100}$/,
    city: /^[A-Za-z\s'-]+$/,
    zipCode: /^\d{5}$/
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    // Marquer le champ comme vérifié après la première interaction
    setIsFieldChecked({
      ...isFieldChecked,
      [id]: true
    });
    // Appliquer la validation uniquement si l'utilisateur a tapé plus de 3 caractères
    if (value.length >= 3) {
      validateField(id, value);
    } else {
      // Réinitialiser l'erreur si moins de 3 caractères sont saisis
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const validateField = (field, value) => {
    let isValid = true;
    let errorMessage = '';

    if (regexPatterns[field]) {
      if (!regexPatterns[field].test(value)) {
        isValid = false;
        errorMessage = `${field} invalide`;
      }
    }

    setErrors({
      ...errors,
      [field]: isValid ? '' : errorMessage
    });
  };

  const validateStep = () => {
    let stepErrors = {};
    let isValid = true;

    switch (activeStep) {
      case 0:
        if (!regexPatterns.firstName.test(formData.firstName)) {
          stepErrors.firstName = 'Prénom invalide';
          isValid = false;
        }
        if (!regexPatterns.lastName.test(formData.lastName)) {
          stepErrors.lastName = 'Nom invalide';
          isValid = false;
        }
        break;
      case 1:
        if (!regexPatterns.street.test(formData.street)) {
          stepErrors.street = 'Rue invalide';
          isValid = false;
        }
        if (!regexPatterns.city.test(formData.city)) {
          stepErrors.city = 'Ville invalide';
          isValid = false;
        }
        if (!regexPatterns.zipCode.test(formData.zipCode)) {
          stepErrors.zipCode = 'Code postal invalide';
          isValid = false;
        }
        break;
      default:
        break;
    }

    setErrors(stepErrors);
    setIsStepValid(isValid);
  };

  useEffect(() => {
    validateStep(); // Valider l'étape actuelle à chaque modification du formulaire
  }, [formData, activeStep]);

  const handleNext = (e) => {
    e.preventDefault();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isStepValid) {
      onFormSubmit(formData);
    }
    const newEmployee = formData;
    addEmployee(newEmployee);
    setOpenModal(true); // Ouvrir la modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      firstName: '',
    lastName: '',
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: '',
    startDate: ''
    })
    setActiveStep(0)
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <label htmlFor="firstName">Prénom</label>
            <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
            {isFieldChecked.firstName && errors.firstName && <span className="error">{errors.firstName}</span>}

            <label htmlFor="lastName">Nom</label>
            <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
            {isFieldChecked.lastName && errors.lastName && <span className="error">{errors.lastName}</span>}

            <label htmlFor="dateOfBirth">Date de Naissance</label>
            <DatePickerValue fieldName="dateOfBirth" formData={formData} setFormData={setFormData}/>

          </>
        );
      case 1:
        return (
          <>
            <label htmlFor="street">Rue</label>
            <input type="text" id="street" value={formData.street} onChange={handleChange} />
            {isFieldChecked.street && errors.street && <span className="error">{errors.street}</span>}

            <label htmlFor="city">Ville</label>
            <input type="text" id="city" value={formData.city} onChange={handleChange} />
            {isFieldChecked.city && errors.city && errors.city && <span className="error">{errors.city}</span>}

            <Dropdown
              label="État"
              id="state"
              options={states.map((state) => state.name)}
              value={formData.state}
              onChange={handleChange}
            />

            <label htmlFor="zipCode">Code Postal</label>
            <input type="text" id="zipCode" value={formData.zipCode} onChange={handleChange} />
            {isFieldChecked.zipCode && errors.zipCode && <span className="error">{errors.zipCode}</span>}
          </>
        );
      case 2:
        return (
          <>
            <Dropdown
              label="Département"
              id="department"
              options={departments}
              value={formData.department}
              onChange={handleChange}
            />

            <label htmlFor='startDate'>Start Date</label>
            <DatePickerValue fieldName="startDate" formData={formData} setFormData={setFormData}/>

          </>
        );
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>{steps[activeStep]}</Typography>
        {getStepContent(activeStep)}
        <MobileStepper className='stepper'
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          nextButton={
            activeStep === 2 ? (
              <Button size="small" type="submit" disabled={!isStepValid}>
                Enregistrer
              </Button>
            ) : (
              <Button size="small" type="button" onClick={handleNext} disabled={!isStepValid}>
                Suivant
                <KeyboardArrowRight sx={{color: '#EAEAEA'
            }}/>
              </Button>
            )
          }
          backButton={
            <Button size="small" type="button" onClick={handleBack} disabled={activeStep === 0} sx={{color: '#EAEAEA'
            }}>
              <KeyboardArrowLeft sx={{color: '#EAEAEA'
            }}/>
              Retour
            </Button>
          }
          sx={{backgroundColor: '#624AD0'
           }}
        />
        <SuccessModal open={openModal} handleClose={handleCloseModal} />
      </form>
    </div>
  );
};

export default CreateEmployee;
