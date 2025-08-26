import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Chat() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState("");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);

    socket.onopen = () => console.log("WebSocket connected");
    
    socket.onclose = () => console.log("WebSocket disconnected");

    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "message" && msg.data) {
          setMessages((prev) => {
            
            if (prev.some((m) => m.id === msg.data.id)) return prev;
            return [...prev, msg.data];
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    setWs(socket);
    return () => socket.close();
  }, [token]);

  const sendMessage = async () => {
    if (!recipient || !text) return alert("Enter recipient and message");

    try {
      
      
      setText(""); 

      await axios.post(
        "http://127.0.0.1:8000/messages",
        { recipient, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  const loadChat = async () => {
    if (!recipient) return alert("Enter recipient email to load chat");
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/messages/${recipient}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load chat");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Logged in as: {email}</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Recipient email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={loadChat}>Load Chat</button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ marginRight: "10px", width: "300px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          width: "400px",
          height: "400px",
          overflowY: "scroll",
        }}
      >
        <h3>Messages:</h3>
        {messages.map((m, i) => (
          <p key={m.id || i}>
            <b>{m.sender === email ? "You" : m.sender}</b>: {m.content}
            <br />
           
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Chat;