import React, { useState } from "react";
import NavBar from "../mainPage/navBar.jsx";
import ChatList from "./chatList.jsx";
import ChatWindow from "./chatWindow.jsx";
import { students } from "../mainPage/studentData.js";
import chatBackground from "../assets/chatBackground.jpeg";

function ChatPage() {
  const currentUser = students.find((student) => student.id === 1);
  const friends = students.filter((student) =>
    currentUser.friends.includes(student.id)
  );

  const users = friends.map((friend) => ({
    id: friend.id,
    name: friend.name,
    avatar: friend.profileImage,
    lastMessage: "",
  }));

  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <div className="d-flex vh-100 flex-column">
      <NavBar currentUser={currentUser} />
      <div
        className="d-flex"
        style={{
          flex: 1,
          overflow: "hidden",
          backgroundImage: `url(${chatBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <ChatList
          users={users}
          onSelect={setSelectedUser}
          selectedUser={selectedUser}
        />
        <ChatWindow user={selectedUser} />
      </div>
    </div>
  );
}

export default ChatPage;
