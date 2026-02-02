import React, { useState, useEffect } from "react";
import NavBar from "../mainPage/navBar.jsx";
import ChatList from "./chatList.jsx";
import ChatWindow from "./chatWindow.jsx";
import { getCurrentUser, getConversations, getFriends } from "../services/api.js";

function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user and conversations from backend
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const cached = sessionStorage.getItem("currentUser");
        if (cached) {
          const user = JSON.parse(cached);
          if (!cancelled) setCurrentUser(user);
        }
        const user = await getCurrentUser();
        if (cancelled) return;
        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
        if (!user) {
          setLoading(false);
          return;
        }
        const [conversations, friends] = await Promise.all([
          getConversations(),
          getFriends(),
        ]);
        if (cancelled) return;
        const conversationMap = new Map();
        (conversations || []).forEach((c) => {
          conversationMap.set(c.otherUser.id, {
            id: c.otherUser.id,
            name: c.otherUser.name,
            avatar: c.otherUser.profileImage || "",
            lastMessage: c.lastMessage || "",
            lastMessageTime: c.lastMessageTime,
          });
        });
        (friends || []).forEach((f) => {
          if (!conversationMap.has(f.id)) {
            conversationMap.set(f.id, {
              id: f.id,
              name: f.name,
              avatar: f.profileImage || "",
              lastMessage: "",
              lastMessageTime: null,
            });
          }
        });
        const list = Array.from(conversationMap.values()).sort((a, b) => {
          const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
          const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
          return bTime - aTime;
        });
        setUsers(list);
        if (list.length > 0 && !selectedUser) {
          setSelectedUser(list[0]);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load chat.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Set default selectedUser when users load and none selected
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  if (loading) return <p>Loading chat...</p>;
  if (error) return <p className="text-danger p-3">{error}</p>;
  if (!currentUser) return <p>Please log in to use chat.</p>;

  return (
    <div className="d-flex flex-column vh-100">
      <header>
        <NavBar currentUser={currentUser} />
      </header>
      <div className="d-flex flex-grow-1" style={{ minHeight: 0, backgroundColor: "#f8f9fa" }}>
        <ChatList
          users={users}
          onSelect={setSelectedUser}
          selectedUser={selectedUser}
        />
        {selectedUser ? (
          <ChatWindow user={selectedUser} currentUserId={currentUser.id} />
        ) : (
          <div className="d-flex flex-grow-1 align-items-center justify-content-center text-muted">
            Select a conversation or start a new chat from friends.
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;