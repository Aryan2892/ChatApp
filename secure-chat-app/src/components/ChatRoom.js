// secure-chat-app/src/components/ChatRoom.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [socket, setSocket] = useState(null);
  

  useEffect(() => {
    // Initialize Socket.IO client
    const newSocket = io('http://127.0.0.1:5000');
    setSocket(newSocket);

    // Fetch the logged-in user
    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/user');
        setLoggedInUser(response.data.username);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };

    fetchLoggedInUser();

    // Clean up the socket connection when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, []);

  useEffect(() => {
    // Listen for new messages from the server
    if (socket) {
      socket.on('new-message', (newMessage) => {
        console.log('Received new message:', newMessage);
        setChat((prevChat) => [...prevChat, newMessage]);
      });
    }
  }, [socket]);

  const handleSendMessage = async () => {
    try {
      // Send the message to the server
      await axios.post(
        'http://127.0.0.1:5000/send-message',
        {
          username: loggedInUser,
          message,
        },
        // Include the token for authentication
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      // Clear the message input
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const fetchChat = async () => {
    try {
      // Fetch the chat from the server
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:5000/get-chat', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Fetched chat:', response.data);

      setChat(response.data);
    } catch (error) {
      console.error('Error fetching chat:', error.message);
    }
  };

  // Fetch the chat when the component mounts
  useEffect(() => {
    fetchChat();
  }, []);

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
