import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubmitDeal from './pages/SubmitDeal';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import { useState, useEffect } from 'react';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/check_login', {
      credentials: 'include'  
    })
    .then(res => res.json())
    .then(data => {
      if (data.logged_in) {
        setLoggedIn(true);
        setUserId(data.user_id);
      }
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitDeal />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
export default App;

