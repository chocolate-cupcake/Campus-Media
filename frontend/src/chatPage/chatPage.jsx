import React, { useState, useEffect } from "react";
import NavBar from "../mainPage/navBar.jsx";
import ChatList from "./chatList.jsx";
import ChatWindow from "./chatWindow.jsx";
import { getStudents } from "../mainPage/studentData.js";
import chatBackground from "../assets/chatBackground.jpeg";

function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load current user once
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  // Prepare friends & users (hooks are at top level)
  const students = getStudents();

  const friends = currentUser
    ? students.filter((student) => currentUser.friends.includes(student.id))
    : [];

  const users = friends.map((friend) => ({
    id: friend.id,
    name: friend.name,
    avatar: friend.profileImage,
    lastMessage: "",
  }));

  // Set default selectedUser after users are ready
  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  if (!currentUser || !selectedUser) return <p>Loading chat...</p>;

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