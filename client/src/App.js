import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubmitDeal from './pages/SubmitDeal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitDeal />} />
      </Routes>
    </Router>
  );
}

export default App;
