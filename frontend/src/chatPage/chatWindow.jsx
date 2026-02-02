import React, { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import Message from "./message.jsx";
import ChatInput from "./chatInput.jsx";
import { getMessageHistory, sendMessage as apiSendMessage } from "../services/api.js";
import "./chatStyles.css";

/**
 * ChatWindow Component
 *
 * Loads messages from the backend and sends new messages via the API.
 * Displays sender name and profile image via API message shape (senderName, senderProfileImage).
 *
 * Props:
 * @param {Object} user - The other user in the conversation { id, name, avatar }
 * @param {number} currentUserId - Logged-in user's ID
 */
function ChatWindow({ user, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendError, setSendError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUserId || !user?.id) {
      setMessages([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getMessageHistory(user.id)
      .then((list) => {
        if (cancelled) return;
        const transformed = (list || []).map((m) => ({
          id: m.id,
          message: m.content,
          emoji: "",
          isOwn: Number(m.senderId) === Number(currentUserId),
          timestamp: typeof m.timeSent === "string" ? new Date(m.timeSent).getTime() : m.timeSent,
          senderName: m.senderName,
          senderProfileImage: m.senderProfileImage,
        }));
        setMessages(transformed);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [currentUserId, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText) => {
    if (!messageText || !currentUserId || !user?.id) return;
    setSendError(null);
    apiSendMessage(user.id, messageText)
      .then((saved) => {
        const timeMs = typeof saved.timeSent === "string" ? new Date(saved.timeSent).getTime() : (saved.timeSent && new Date(saved.timeSent).getTime()) || Date.now();
        setMessages((prev) => [
          ...prev,
          {
            id: saved.id,
            message: saved.content,
            emoji: "",
            isOwn: true,
            timestamp: timeMs,
          },
        ]);
      })
      .catch((e) => {
        setSendError(e.message || "Failed to send message.");
      });
  };
  
  return (
    <div className="chat-window-container" style={{ backgroundColor: "#f8f9fa" }}>
      <Card className="chat-header rounded-0 border-bottom shadow-sm" style={{ backgroundColor: "#E8F1FF", borderBottom: "2px solid #B8D4F1" }}>
        <Card.Body className="d-flex align-items-center py-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="chat-header-avatar"
          />
          <h5 className="chat-header-name mb-0 ms-2" style={{ color: "#357ABD" }}>{user.name}</h5>
        </Card.Body>
      </Card>

      {sendError && (
        <div className="alert alert-danger rounded-0 mb-0 py-2" role="alert">
          {sendError}
        </div>
      )}

      <div className="messages-container">
        {loading ? (
          <div className="d-flex justify-content-center py-4 text-muted">Loading messages...</div>
        ) : (
          <>
            {messages.map((msg) => (
              <Message
                key={msg.id}
                message={msg.message}
                emoji={msg.emoji}
                isOwn={msg.isOwn}
                timestamp={msg.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput
        onSend={handleSendMessage}
        receiverId={user?.id}
        disabled={!currentUserId || !user?.id}
      />
    </div>
  );
}

export default ChatWindow;