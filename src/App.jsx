import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Employee from './pages/Employee/Employee';
import NotFound from './pages/NotFound/NotFound';
import { EmployeeProvider } from './utils/EmployeeContext';

//import './App.css'

function App() {

  return (
    <>
      <div>
        <EmployeeProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </EmployeeProvider>
      </div>  
    </>
  )
}

export default App
