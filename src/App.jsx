import Header from './components/Header/Header';
import Router from './router.jsx';

import { EmployeeProvider } from './utils/EmployeeContext';

function App() {

  return (
    
      <div>
        <EmployeeProvider>
          <Header />
          <Router />
        </EmployeeProvider>
      </div>  
    
  )
}

export default App
