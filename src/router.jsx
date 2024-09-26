import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Employee from './pages/Employee/Employee';
import NotFound from './pages/NotFound/NotFound';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/employees" element={<Employee />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
