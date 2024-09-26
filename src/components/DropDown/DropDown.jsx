import React from 'react';
import PropTypes from 'prop-types';

import './dropdown.css'

const Dropdown = ({ label, id, options, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
      <option value="" disabled>
          Sélectionnez un {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,     // Le label du dropdown
  id: PropTypes.string.isRequired,        // L'ID unique pour le dropdown
  options: PropTypes.arrayOf(PropTypes.string).isRequired, // Liste des options (tableau de chaînes de caractères)
  value: PropTypes.string.isRequired,     // La valeur sélectionnée
  onChange: PropTypes.func.isRequired     // Fonction pour gérer le changement de valeur
};