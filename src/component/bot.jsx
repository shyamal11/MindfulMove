import React, { useState, useRef, useEffect } from "react";
import "../styles/bot.css";
import roundImage from "../assets/img/Home_page.png"; // Adjust the path

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleBot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: getBotResponse(input),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1000); // Simulate bot typing for 1 second
  };

  const getBotResponse = (message) => {
    // Simple predefined responses
    switch (message.toLowerCase()) {
      case "hello":
        return "Hi there! How can I assist you today?";
      case "how are you?":
        return "I'm just a bot, but I'm here to help!";
      case "what can you do?":
        return "I can answer your questions and help you with your queries.";
      default:
        return "I'm sorry, I didn't understand that. Can you please rephrase?";
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <div className="bot-container">
      <button className="bot-toggle" onClick={toggleBot}>
        <i className="bot-icon">💬</i>
      </button>
      <div className={`bot-window ${isOpen ? 'open' : ''}`}>
        <div className="bot-header">
          <span className="bot-title">
            <img src={roundImage} alt="Round Image" />
            Chatbot
          </span>
          <button className="close-button" onClick={toggleBot}>
            &times;
          </button>
        </div>
        <div className="bot-content">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing-indicator">
                <span>...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bot;
