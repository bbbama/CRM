import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importy komponentów i stron
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Partners from './pages/Partners';
import PartnerDetails from './pages/PartnerDetails';
import Users from './pages/Users';
import Events from './pages/Events';

import './index.css';

function App() {
  // Sprawdzamy czy użytkownik jest zalogowany na podstawie tokenu w localStorage
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  // Funkcja wylogowania - usuwamy token i zmieniamy stan
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  return (
    <Router>
      {/* Pokaż Navbar tylko jeśli użytkownik jest zalogowany */}
      {isAuth && <Navbar onLogout={logout} />}
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Publiczne trasy */}
          <Route 
            path="/login" 
            element={!isAuth ? <Login setAuth={setIsAuth} /> : <Navigate to="/partners" />} 
          />

          {/* Chronione trasy */}
          <Route 
            path="/partners" 
            element={isAuth ? <Partners /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/partners/:id" 
            element={isAuth ? <PartnerDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/users" 
            element={isAuth ? <Users /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/events" 
            element={isAuth ? <Events /> : <Navigate to="/login" />} 
          />

          {/* Domyślne przekierowanie */}
          <Route path="/" element={<Navigate to="/partners" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
