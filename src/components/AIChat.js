import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AIChat.css';

const AIChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI shopping assistant for Recycle Hub. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const sendMessageToGemini = async (message) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_AI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful AI assistant for Recycle Hub, an online marketplace for buying and selling used items. 
              
              Context: You're helping users navigate the platform, find products, understand how to sell items, and provide general assistance about the marketplace.
              
              User's message: ${message}
              
              Please provide a helpful, friendly response. Keep it concise but informative. If they're asking about specific products, suggest they browse the categories or use the search function.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again later or contact support if the issue persists.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(userMessage.content);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI shopping assistant for Recycle Hub. How can I help you today?',
      timestamp: new Date()
    }]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
    "How do I sell an item?",
    "What categories are available?",
    "How do I contact a seller?",
    "How does the pricing work?",
    "Is my information secure?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`chat-fab ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
        <div className="fab-icon">
          {isOpen ? (
            <i className="fas fa-times"></i>
          ) : (
            <>
              <i className="fas fa-robot"></i>
              <div className="notification-dot"></div>
            </>
          )}
        </div>
        {!isOpen && (
          <div className="fab-tooltip">
            <span>AI Assistant</span>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="ai-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="chat-title">
              <h4>AI Shopping Assistant</h4>
              <span className="chat-status">
                <span className="status-indicator online"></span>
                Online
              </span>
            </div>
          </div>
          <div className="chat-actions">
            <button className="chat-action-btn" onClick={clearChat} title="Clear chat">
              <i className="fas fa-eraser"></i>
            </button>
            <button className="chat-action-btn" onClick={toggleChat} title="Close chat">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'ai' ? (
                  <i className="fas fa-robot"></i>
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {message.content}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai">
              <div className="message-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="suggested-questions">
            <p>Quick questions:</p>
            <div className="suggestions-grid">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows="1"
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>
          <div className="powered-by">
            Powered by <span>Google AI Studio</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="chat-overlay" onClick={toggleChat}></div>}
    </>
  );
};

export default AIChat;
