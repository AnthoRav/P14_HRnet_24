import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'vite-modal-library';
import './modal.css'

function ModalVite({ isOpen, onClose}) {


  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2>Employé ajouté avec succès</h2>
        <div className="wrapper"> <svg className="animated-check" viewBox="0 0 24 24">
          <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" /> </svg>
        </div>
        <p>Votre employé a été enregistré dans la base de données.</p>
      </Modal>
    </div>
  );
}

export default ModalVite;

ModalVite.propTypes = {
  isOpen: PropTypes.bool.isRequired,  // Vérifie que isOpen est un booléen obligatoire
  onClose: PropTypes.func.isRequired, // Vérifie que onClose est une fonction obligatoire
};