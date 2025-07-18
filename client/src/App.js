import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubmitDeal from './pages/SubmitDeal';
import DealDetails from './pages/DealDetails'; 
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitDeal />} />
        <Route path="/deal/:id" element={<DealDetails />} /> 
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
