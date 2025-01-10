import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BoardPage from './components/BoardPage';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/board" replace />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !user ? (
              <Register />
            ) : (
              <Navigate to="/board" replace />
            )
          } 
        />
        <Route 
          path="/board" 
          element={
            user ? (
              <BoardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/board" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
