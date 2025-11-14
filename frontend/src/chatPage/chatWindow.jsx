import React, { useState, useEffect, useRef } from "react";
import { Button, Form, InputGroup, Dropdown, Card } from "react-bootstrap";
import { SendFill } from "react-bootstrap-icons";
import Message from "./message.jsx";
import { getConversation, createMessage } from "./messageModel.js";
import { commonEmojis, emojiCategories } from "./emojiHelper.js";
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
  
  // State for the current message being typed
  const [newMessage, setNewMessage] = useState("");
  
  // State for selected emoji
  const [selectedEmoji, setSelectedEmoji] = useState("");
  
  // State for controlling emoji picker visibility
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser ? currentUser.id : null;
  
  // Refs for scrolling and emoji picker container
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
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
   * Handles clicking outside emoji picker to close it
   * Bootstrap Dropdown handles this automatically with onToggle,
   * but we keep this for additional control if needed
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        // Check if click is not on the dropdown toggle button
        const toggleButton = event.target.closest('.emoji-button');
        if (!toggleButton) {
          setShowEmojiPicker(false);
        }
      }
    };
    
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showEmojiPicker]);
  
  /**
   * Sends a new message
   * Creates a message object and saves it to localStorage
   * Works like WhatsApp - messages are persisted and can be retrieved later
   * Emojis are appended to the message text as part of the content
   */
  const sendMessage = () => {
    // Combine message text and emoji
    const fullMessage = (newMessage.trim() + (selectedEmoji ? selectedEmoji : "")).trim();
    
    // Don't send empty messages
    if (!fullMessage) return;
    
    if (currentUserId && user?.id) {
      // Create and save message using messageModel
      // Emojis are included in the message text itself (like WhatsApp)
      const savedMessage = createMessage({
        senderId: currentUserId,
        receiverId: user.id,
        message: fullMessage,
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
        
        // Clear input fields
        setNewMessage("");
        setSelectedEmoji("");
      }
    }
  };
  
  /**
   * Handles Enter key press to send message
   * Shift+Enter creates a new line, Enter alone sends the message
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  /**
   * Handles emoji selection from the picker
   * Adds selected emoji to the message
   */
  const handleEmojiSelect = (emoji) => {
    // Append emoji to message text
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  /**
   * Toggles emoji picker visibility
   */
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
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

      {/* Input Area - message composition and emoji picker using Bootstrap InputGroup */}
      <Card className="chat-input-container rounded-0 border-top-0">
        <Card.Body className="py-2">
          <InputGroup className="input-group-wrapper">
            {/* Emoji Picker using Bootstrap Dropdown */}
            <Dropdown 
              show={showEmojiPicker} 
              align="end"
              onToggle={setShowEmojiPicker}
            >
              <Dropdown.Toggle
                as={Button}
                variant="light"
                className="emoji-button rounded-circle"
                onClick={toggleEmojiPicker}
                aria-label="Open emoji picker"
              >
                😊
              </Dropdown.Toggle>

              <Dropdown.Menu 
                className="emoji-picker-menu p-0" 
                ref={emojiPickerRef}
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <div className="emoji-picker-container">
                  {/* Common Emojis Section */}
                  <div className="emoji-picker-title">Common Emojis</div>
                  <div className="emoji-grid">
                    {commonEmojis.slice(0, 48).map((emoji, index) => (
                      <Button
                        key={index}
                        variant="light"
                        className="emoji-option"
                        onClick={() => handleEmojiSelect(emoji)}
                        aria-label={`Select emoji ${emoji}`}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Smileys Category */}
                  <div className="emoji-category">
                    <div className="emoji-picker-title">Smileys & People</div>
                    <div className="emoji-grid">
                      {emojiCategories.smileys.map((emoji, index) => (
                        <Button
                          key={`smiley-${index}`}
                          variant="light"
                          className="emoji-option"
                          onClick={() => handleEmojiSelect(emoji)}
                          aria-label={`Select emoji ${emoji}`}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hearts Category */}
                  <div className="emoji-category">
                    <div className="emoji-picker-title">Hearts & Emotions</div>
                    <div className="emoji-grid">
                      {emojiCategories.hearts.map((emoji, index) => (
                        <Button
                          key={`heart-${index}`}
                          variant="light"
                          className="emoji-option"
                          onClick={() => handleEmojiSelect(emoji)}
                          aria-label={`Select emoji ${emoji}`}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Gestures Category */}
                  <div className="emoji-category">
                    <div className="emoji-picker-title">Gestures</div>
                    <div className="emoji-grid">
                      {emojiCategories.gestures.slice(0, 24).map((emoji, index) => (
                        <Button
                          key={`gesture-${index}`}
                          variant="light"
                          className="emoji-option"
                          onClick={() => handleEmojiSelect(emoji)}
                          aria-label={`Select emoji ${emoji}`}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
            
            {/* Message Text Input using Bootstrap Form.Control */}
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="message-input rounded-pill"
            />
            
            {/* Send Button using Bootstrap Button with Bootstrap Icons */}
            <Button
              variant="primary"
              onClick={sendMessage}
              disabled={!newMessage.trim() && !selectedEmoji}
              className="send-button rounded-circle"
              aria-label="Send message"
              title="Send message"
            >
              <SendFill size={20} />
            </Button>
          </InputGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ChatWindow;