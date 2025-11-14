import React from "react";
import { formatTimestamp } from "./messageModel.js";
import "./chatStyles.css";

/**
 * Message Component
 * 
 * Displays a single message bubble in the chat conversation.
 * Messages sent by the current user appear on the right (green),
 * while messages from others appear on the left (white).
 * 
 * Props:
 * @param {string} message - Text content of the message
 * @param {string} emoji - Emoji image URL or Unicode character (optional)
 * @param {boolean} isOwn - Whether this message was sent by the current user
 * @param {number} timestamp - Unix timestamp in milliseconds
 */
function Message({ message, emoji, isOwn, timestamp }) {
  return (
    <div className={`message-wrapper ${isOwn ? "own-message" : "received-message"}`}>
      <div className={`message-bubble ${isOwn ? "own" : "received"}`}>
        {/* Message text content - emojis are included in the message text as Unicode */}
        <p className="message-text">
          {message || ""}
          {/* Display additional emoji if stored separately */}
          {emoji && <span className="message-emoji">{emoji}</span>}
        </p>
        
        {/* Timestamp display - shows formatted time below message */}
        {timestamp && (
          <div className="message-timestamp">
            {formatTimestamp(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;