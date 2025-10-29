import React, { useState } from "react";
import Navbar from "../mainPage/NavBar.jsx";
import ChatList from "./chatList.jsx";
import ChatWindow from "./chatWindow.jsx";

function ChatPage() {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <div className="d-flex vh-100 flex-column">
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <ChatList users={users} onSelect={setSelectedUser} />
        <ChatWindow user={selectedUser} />
      </div>
    </div>
  );
}

export default ChatPage;