import React, { useState } from "react";
import Navbar from "../mainPage/NavBar.jsx";
import ChatList from "./chatList.jsx";
import ChatWindow from "./chatWindow.jsx";
import { friendsData } from "../mainPage/friends.jsx";
import chatBackground from "../assets/chatBackground.jpeg";

function ChatPage() {
  // Transform friends data to chat users format
  const users = friendsData.map((friend, index) => ({
    id: index + 1,
    name: friend.username,
    avatar: friend.image,
    lastMessage: "" // Can be customized per friend if needed
  }));

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