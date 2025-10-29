import { useState } from "react";
import Message from "./message.jsx";

function ChatWindow({ user }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi!", isOwn: false },
    { id: 2, text: "Hello!", isOwn: true },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, isOwn: true }]);
    setNewMessage("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        {messages.map(msg => <Message key={msg.id} {...msg} />)}
      </div>
      <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
        <input
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} style={{ marginLeft: "10px" }}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;