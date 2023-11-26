// secure-chat-app/src/components/RegistrationForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'


const RegistrationForm = () => {
 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
     
      // Send registration data to the server
      const response = await axios.post('http://127.0.0.1:5000/register', {
        username,
        password,
      });
      
      navigate('/login');
      // Handle the response (you can modify this based on your server response)
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <Link to="/login">Already have an account? Log in</Link>
    </div>
  );
};

export default RegistrationForm;
