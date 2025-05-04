import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, sender: 'user' };
    setConversation(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          location: location || 'New York' 
        })
      });
      const data = await response.json();
      
      setConversation(prev => [...prev, { 
        text: data.response, 
        sender: 'bot' 
      }]);
    } catch (err) {
      setConversation(prev => [...prev, { 
        text: "Sorry, I encountered an error", 
        sender: 'bot' 
      }]);
    }
    
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Weather Chatbot</h2>
        <div className="location-input">
          <label>Your Location:</label>
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or postal code"
          />
        </div>
      </div>
      
      <div className="chat-messages">
        {conversation.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about the weather..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;