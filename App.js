import React from 'react';
import { Routes, Route } from 'react-router-dom';
 // Ensure About component exists
import Register from './components/Register';  // Ensure Register component exists
import Login from './components/Login';  // Ensure Login component exists
import Dashboard from './components/Dashboard';  // Ensure Dashboard component exists

function App() {
  return (
    <div>
      <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
