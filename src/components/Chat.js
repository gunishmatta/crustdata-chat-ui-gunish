import React, { useState } from "react";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!query.trim()) {
      alert("Please enter a question before sending.");
      return;
    }

    setIsLoading(true);
    setMessages([...messages, { sender: "user", text: query }]);

    try {
      const result = await axios.post(
        process.env.REACT_APP_BACKEND_URL,
        { question: query },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessages([
        ...messages,
        { sender: "user", text: query },
        { sender: "bot", text: result.data.answer || "No answer available." },
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { sender: "user", text: query },
        { sender: "bot", text: "An error occurred while processing your request." },
      ]);
      console.error(error);
    } finally {
      setIsLoading(false);
      setQuery(""); // Reset the query field after sending
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Crustdata Agent</h1>
      </header>
      <main className="chat-main">
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="chat-message-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <textarea
          rows="3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about Crustdata's API..."
          className="chat-textarea"
        />
        <button onClick={handleSend} className="chat-button" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </main>
    </div>
  );
};

export default Chat;
