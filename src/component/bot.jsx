import React, { useState, useRef, useEffect } from "react";


const Bot = ({ isOpen, toggleBot }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the bot window is expanded
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
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

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCloseBot = () => {
    setIsExpanded(false); // Reset expanded state when closing the bot
    toggleBot(); // Call the parent's toggleBot to close the bot
  };

  return (
    <div className="bot-container">
      {isOpen && isExpanded && <div className="overlay" onClick={handleExpand} />} {/* Overlay only when expanded */}
      <div className={`bot-window ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
        <div className="bot-header">
          <span className="bot-title">
            <img src="https://shyamal11.github.io/backend-innerBalanceHub/assets/img/istockphoto-1073043572-612x612.jpg" alt="bot logo" />
            Chatbot
          </span>
          <button className="close-button" onClick={handleCloseBot}>
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
          {/* Expand option */}
          <div className="expand-option">
           
            <button onClick={handleExpand}>{isExpanded ? "Reduce Window" : "Expand Window"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bot;
