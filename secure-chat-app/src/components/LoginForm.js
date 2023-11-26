// secure-chat-app/src/components/LoginForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';



const LoginForm = () => {
  
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  

  // Initialize Socket.IO client
  const socket = io('http://127.0.0.1:5000');

  useEffect(() => {
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [socket]); // Include socket in the dependencies array to satisfy the ESLint exhaustive-deps rule

  const handleLogin = async () => {
    try {
      // Send login data to the server
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
      });

      // Handle the response
      console.log('Login successful:', response.data);

      // Store the token securely (e.g., in local storage)
      localStorage.setItem('token', response.data.token);

      // Emit a 'login' event to the Socket.IO server
      socket.emit('login', { username });
     
      navigate('/chatroom');
      // Navigate or update the UI as needed
      // You might want to use React Router for navigation
      // Example: history.push('/chatroom');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
