import React, { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import Message from "./message.jsx";
import ChatInput from "./chatInput.jsx";
import { getConversation, createMessage } from "./messageModel.js";
import "./chatStyles.css";

/**
 * ChatWindow Component
 * 
 * Main chat interface component that displays messages and handles sending new messages.
 * This component:
 * - Loads messages from localStorage for the current conversation
 * - Displays messages in chronological order
 * - Allows sending text messages and emojis
 * - Provides an emoji picker for quick emoji selection
 * - Auto-scrolls to latest message when new messages arrive
 * 
 * Props:
 * @param {Object} user - The user object representing the person you're chatting with
 * @param {number} user.id - ID of the user you're chatting with
 * @param {string} user.name - Name of the user
 * @param {string} user.avatar - Avatar image URL
 */
function ChatWindow({ user }) {
  // State for managing messages in the conversation
  const [messages, setMessages] = useState([]);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser ? currentUser.id : null;
  
  // Ref for scrolling to bottom of messages
  const messagesEndRef = useRef(null);
  
  /**
   * Loads messages from localStorage when the component mounts or when user changes
   * This works like WhatsApp - it retrieves all messages between current user and selected user
   */
  useEffect(() => {
    if (currentUserId && user?.id) {
      // Get all messages in this conversation from localStorage
      const conversationMessages = getConversation(currentUserId, user.id);
      
      // Transform messages to include isOwn flag for display purposes
      const transformedMessages = conversationMessages.map((msg) => ({
        ...msg,
        isOwn: msg.senderId === currentUserId, // True if message was sent by current user
      }));
      
      setMessages(transformedMessages);
      
      // Scroll to bottom when messages load
      scrollToBottom();
    }
  }, [currentUserId, user?.id]);
  
  /**
   * Scrolls the messages container to the bottom
   * This ensures the latest message is always visible (like WhatsApp)
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  /**
   * Handles sending a message from the ChatInput component
   * Creates a message object and saves it to localStorage
   * Works like WhatsApp - messages are persisted and can be retrieved later
   * 
   * @param {string} messageText - The message text content
   * @param {string} emoji - The emoji (if any) - emojis are stored as part of message text
   */
  const handleSendMessage = (messageText, emoji) => {
    if (!messageText) return;
    
    if (currentUserId && user?.id) {
      // Create and save message using messageModel
      // Emojis are included in the message text itself (like WhatsApp)
      const savedMessage = createMessage({
        senderId: currentUserId,
        receiverId: user.id,
        message: messageText,
        emoji: "", // Emojis are stored as part of message text
      });
      
      if (savedMessage) {
        // Add message to local state for immediate display
        setMessages([
          ...messages,
          {
            ...savedMessage,
            isOwn: true,
          },
        ]);
      }
    }
  };
  
  return (
    <div className="chat-window-container">
      {/* Chat Header - displays recipient info using Bootstrap Card */}
      <Card className="chat-header rounded-0 border-bottom-0">
        <Card.Body className="d-flex align-items-center py-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="chat-header-avatar"
          />
          <h5 className="chat-header-name mb-0 ms-2">{user.name}</h5>
        </Card.Body>
      </Card>

      {/* Messages Area - displays all messages in the conversation */}
      <div className="messages-container">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg.message}
            emoji={msg.emoji}
            isOwn={msg.isOwn}
            timestamp={msg.timestamp}
          />
        ))}
        {/* Invisible div to scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - uses ChatInput component */}
      <ChatInput
        onSend={handleSendMessage}
        receiverId={user?.id}
        disabled={!currentUserId || !user?.id}
      />
    </div>
  );
}

export default ChatWindow;