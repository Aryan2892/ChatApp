import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import ChatRoom from './components/ChatRoom';


function App() {
  return (
    
    <Router>
      <div className="App">
        <h1>Secure Chat App</h1>
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/" element={<Navigate replace to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
