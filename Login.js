// src/components/Login.js

import React, { useState } from 'react';
import { loginUser } from '../services/api';  // Correct import path

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = {
      email,
      password
    };

    try {
      const response = await loginUser(credentials);  // Call the loginUser function from API
      console.log('User logged in:', response);
      // Handle the successful login logic (e.g., save JWT, redirect user)
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
