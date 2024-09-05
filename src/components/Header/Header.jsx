import React from 'react';
import Logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import "./header.css"

const Header= () => {
  return (
    <header>
      <Link to="/"><img src={Logo} alt='Wealth Health Logo' /></Link>
      <h1>HRnet</h1>
      <Link className='link' to="/employees">Current Employees</Link>
    </header>
  )
}

export default Header