import React, { useState, useEffect, useRef } from "react";
import { Button, Form, InputGroup, Dropdown, Card } from "react-bootstrap";
import { SendFill } from "react-bootstrap-icons";
import { commonEmojis, emojiCategories } from "./emojiHelper.js";
import "./chatStyles.css";

/**
 * ChatInput Component
 * 
 * Handles the message input area including:
 * - Text input field for typing messages
 * - Emoji picker for selecting emojis
 * - Send button for submitting messages
 * 
 * This component manages its own state for the input and emoji picker,
 * and calls the onSend callback when a message is submitted.
 * 
 * Props:
 * @param {Function} onSend - Callback function called when message is sent
 *                            Receives (messageText, emoji) as parameters
 * @param {number} receiverId - ID of the user receiving the message
 * @param {boolean} disabled - Whether the input is disabled
 */
function ChatInput({ onSend, receiverId, disabled = false }) {
  // State for the current message being typed
  const [newMessage, setNewMessage] = useState("");
  
  // State for selected emoji (kept for future use)
  const [selectedEmoji, setSelectedEmoji] = useState("");
  
  // State for controlling emoji picker visibility
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Ref for emoji picker container (for click outside detection)
  const emojiPickerRef = useRef(null);
  
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
   * Handles sending a message
   * Combines message text and emoji, then calls the onSend callback
   */
  const handleSendMessage = () => {
    // Combine message text and emoji
    const fullMessage = (newMessage.trim() + (selectedEmoji ? selectedEmoji : "")).trim();
    
    // Don't send empty messages
    if (!fullMessage) return;
    
    // Call the parent's send handler
    if (onSend) {
      onSend(fullMessage, selectedEmoji);
      
      // Clear input fields after sending
      setNewMessage("");
      setSelectedEmoji("");
    }
  };
  
  /**
   * Handles Enter key press to send message
   * Shift+Enter creates a new line, Enter alone sends the message
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  /**
   * Handles emoji selection from the picker
   * Appends selected emoji to the message text
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
              disabled={disabled}
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
            disabled={disabled}
          />
          
          {/* Send Button using Bootstrap Button with Bootstrap Icons */}
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedEmoji) || disabled}
            className="send-button rounded-circle"
            aria-label="Send message"
            title="Send message"
          >
            <SendFill size={20} />
          </Button>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default ChatInput;

