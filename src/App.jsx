import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import './App.css'

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("message", { message });
    setMessage("");
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      setMessages([...messages, data]);
    });
  }, [socket, messages]);

  return (
    <div className="chat">
      <ul
      className="msg"
        style={{
          listStyle: "none",
          padding: 0,
          overflowY: "scroll",
          display:"flex",
          
          flexDirection:"column",
          maxHeight: "300px", // para limitar a altura da lista
        }}
      >
        {messages.map((message, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: message.sent ? "flex-end" : "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                background: message.sent ? "#f1f0f0" : "#0099ff",
                color: message.sent ? "#333" : "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "1rem",
                maxWidth: "60%",
                textAlign: message.sent ? "right" : "left",
              }}
            >
              {message.message}
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
