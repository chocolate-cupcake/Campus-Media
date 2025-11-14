/**
 * messageModel.js
 * 
 * This module handles all message storage and retrieval operations.
 * Messages are stored in localStorage in JSON format with the following structure:
 * {
 *   id: string (unique identifier),
 *   senderId: number (ID of the user sending the message),
 *   receiverId: number (ID of the user receiving the message),
 *   message: string (text content of the message),
 *   emoji: string (emoji image URL/path if message contains emoji),
 *   timestamp: number (Unix timestamp in milliseconds)
 * }
 * 
 * IMPORTANT: LOCALSTORAGE LIMITATION
 * ===================================
 * localStorage is isolated per browser window/tab. Each browser instance has its own
 * separate localStorage. This means:
 * - Messages sent in one browser window won't be visible in another browser window
 * - To test conversations, use the SAME browser window and switch accounts
 * - For production, you'll need a backend server with a database to share messages
 *   across different browser instances/sessions
 * 
 * The module provides functions to:
 * - Save messages to localStorage
 * - Retrieve messages from localStorage
 * - Get messages for a specific conversation between two users
 * - Create new messages with proper structure
 */

// Storage key used in localStorage to store all messages
const STORAGE_KEY = "chat_messages";

/**
 * Retrieves all messages from localStorage
 * @returns {Array} Array of all messages, or empty array if none exist
 */
export function getMessages() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading messages from localStorage:", error);
    return [];
  }
}

/**
 * Saves all messages to localStorage
 * @param {Array} messages - Array of message objects to save
 */
function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to localStorage:", error);
  }
}

/**
 * Creates and saves a new message
 * @param {Object} messageData - Message data object
 * @param {number} messageData.senderId - ID of the user sending the message
 * @param {number} messageData.receiverId - ID of the user receiving the message
 * @param {string} messageData.message - Text content of the message (optional)
 * @param {string} messageData.emoji - Emoji image URL/path (optional)
 * @returns {Object} The created message object with all properties
 */
export function createMessage({ senderId, receiverId, message = "", emoji = "" }) {
  // Validate required fields
  if (!senderId || !receiverId) {
    console.error("senderId and receiverId are required");
    return null;
  }

  // Get existing messages
  const messages = getMessages();

  // Create new message object with all required attributes
  const newMessage = {
    id: crypto.randomUUID() || `msg_${Date.now()}_${Math.random()}`, // Unique ID
    senderId: Number(senderId), // Ensure it's a number
    receiverId: Number(receiverId), // Ensure it's a number
    message: message || "", // Message text content
    emoji: emoji || "", // Emoji image URL if message contains emoji
    timestamp: Date.now(), // Current timestamp in milliseconds
  };

  // Add new message to array
  messages.push(newMessage);

  // Save updated messages array
  saveMessages(messages);

  return newMessage;
}

/**
 * Retrieves all messages in a conversation between two users
 * Works like WhatsApp - gets all messages where user1 and user2 are sender/receiver
 * Messages are sorted by timestamp (oldest first)
 * 
 * @param {number} user1Id - ID of first user
 * @param {number} user2Id - ID of second user
 * @returns {Array} Array of messages in the conversation, sorted by timestamp
 */
export function getConversation(user1Id, user2Id) {
  const messages = getMessages();
  
  // Filter messages where the two users are sender and receiver (bidirectional)
  const conversation = messages.filter(
    (m) =>
      (m.senderId === Number(user1Id) && m.receiverId === Number(user2Id)) ||
      (m.senderId === Number(user2Id) && m.receiverId === Number(user1Id))
  );

  // Sort messages by timestamp (oldest first) so they display in chronological order
  return conversation.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Formats a timestamp into a readable date/time string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date/time string (e.g., "10:30 AM" or "Yesterday 2:15 PM")
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Today - show only time
  if (diffDays === 1 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  // Yesterday
  if (diffDays === 2) {
    return `Yesterday ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  // Same week
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
  }
  // Older - show full date
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/**
 * Clears all messages from localStorage (useful for testing or reset)
 */
export function clearMessages() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Deletes a specific message by ID
 * @param {string} messageId - ID of the message to delete
 * @returns {boolean} True if message was deleted, false otherwise
 */
export function deleteMessage(messageId) {
  const messages = getMessages();
  const filtered = messages.filter((m) => m.id !== messageId);
  
  if (filtered.length < messages.length) {
    saveMessages(filtered);
    return true;
  }
  return false;
}
