import React, { useState } from "react";
import Navbar from "../mainPage/NavBar.jsx";
import ChatList from "./chatList.jsx";
import ChatWindow from "./chatWindow.jsx";
import brianImg from "../assets/brianImg.jpg";
import peterImg from "../assets/peterImg.jpg";
import stewieImg from "../assets/stewieImg.jpg";
import chatBackground from "../assets/chatBackground.jpeg";

function ChatPage() {
  const users = [
    { id: 1, name: "Brian Griffin", avatar: brianImg, lastMessage: "Hey, how's it going?" },
    { id: 2, name: "Peter Griffin", avatar: peterImg, lastMessage: "Let's grab lunch!" },
    { id: 3, name: "Stewie Griffin", avatar: stewieImg, lastMessage: "Blast! This is incredible." }
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <div className="d-flex vh-100 flex-column">
      <Navbar />
      <div 
        className="d-flex" 
        style={{ 
          flex: 1, 
          overflow: "hidden",
          backgroundImage: `url(${chatBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <ChatList users={users} onSelect={setSelectedUser} selectedUser={selectedUser} />
        <ChatWindow user={selectedUser} />
      </div>
    </div>
  );
}

export default ChatPage;