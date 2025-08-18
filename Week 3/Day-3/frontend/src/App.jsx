// App.jsx

import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import LoginPage from './pages/loginPage.jsx';
import RegisterPage from './pages/registerPage.jsx';

function App() {
  return (
    <Routes>  
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
