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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="d-flex flex-column" style={{ flex: 1, height: "100%", width: "100%" }}>
      {/* Chat header */}
      <div className="bg-white border-bottom p-3 bg-opacity-90">
        <div className="d-flex align-items-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="rounded-circle me-3"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <h5 className="mb-0 fw-semibold">{user.name}</h5>
        </div>
      </div>

      {/* Messages area */}
      <div 
        className="flex-grow-1 p-3"
        style={{ 
          overflowY: "auto"
        }}
      >
        {messages.map(msg => <Message key={msg.id} {...msg} />)}
      </div>

      {/* Input area */}
      <div className="bg-white border-top p-3 bg-opacity-90">
        <div className="d-flex align-items-center gap-2">
          <input
            className="form-control"
            style={{ borderRadius: "20px" }}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
          />
          <button 
            onClick={sendMessage} 
            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px", minWidth: "42px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm-.792-.744L1.813 6.802l4.87-1.436z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;