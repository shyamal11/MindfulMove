

import React, { useState, useRef, useEffect } from "react";

import bot from '../assets/img/bot-10-2-512.png'


const Bot = ({ isOpen, toggleBot }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the bot window is expanded
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
        sender: "user",
        text: input,
    };

    // Update the message state with the user's message
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
        // Fetch the bot's response from OpenAI API
        const botResponseText = await fetchOpenAIResponse(input);

        const botMessage = {
            sender: "bot",
            text: botResponseText,
        };

        // Update the message state with the bot's response
        setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);

        // Add an error message if the API call fails
        const errorMessage = {
            sender: "bot",
            text: "Sorry, I couldn't process your request. Please try again later.",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
        setIsTyping(false);
    }
};

// Function to fetch OpenAI response
const fetchOpenAIResponse = async (userInput) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini", // Specify the OpenAI model
            messages: [
              { 
                  role: "system", 
                  content: "You are a virtual doctor providing initial medical guidance and advice based on user input. Always remind users to consult a licensed medical professional for definitive diagnosis and treatment."
              },
              { role: "user", content: userInput },
          ],
          max_tokens: 300,
          temperature: 0.5, // Lower temperature for more factual responses
      }),
  });


    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
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
            <img src={bot} alt="bot logo" />
            Hi! How can I help you?
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
