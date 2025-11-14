import React from "react";
import { ListGroup, Card } from "react-bootstrap";

/**
 * ChatList Component
 * 
 * Displays a list of users/conversations using Bootstrap ListGroup.
 * Uses Bootstrap components for consistent styling and better accessibility.
 * 
 * Props:
 * @param {Array} users - Array of user objects to display in the list
 * @param {Function} onSelect - Callback function when a user is selected
 * @param {Object} selectedUser - Currently selected user object
 */
function ChatList({ users, onSelect, selectedUser }) {
  return (
    <div
      className="border-end"
      style={{
        width: "400px",
        height: "100%",
        overflowY: "auto",
        backgroundColor: "#ffffff",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header using Bootstrap Card */}
      <Card className="rounded-0 border-bottom shadow-sm" style={{ backgroundColor: "#E8F1FF", borderBottom: "2px solid #B8D4F1" }}>
        <Card.Body className="py-3">
          <h5 className="mb-0 fw-bold" style={{ color: "#357ABD" }}>Messages</h5>
        </Card.Body>
      </Card>

      {/* User list using Bootstrap ListGroup */}
      <ListGroup variant="flush" className="border-end-0">
        {users.map((user) => (
          <ListGroup.Item
            key={user.id}
            action
            active={selectedUser?.id === user.id}
            onClick={() => onSelect(user)}
            className="d-flex align-items-center py-3 border-bottom"
            style={{ 
              cursor: "pointer",
              backgroundColor: selectedUser?.id === user.id ? "#E8F1FF" : "#ffffff",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (selectedUser?.id !== user.id) {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedUser?.id !== user.id) {
                e.currentTarget.style.backgroundColor = "#ffffff";
              }
            }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-circle me-3"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="flex-grow-1">
              <div className="fw-semibold">{user.name}</div>
              {user.lastMessage && (
                <div className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>
                  {user.lastMessage}
                </div>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ChatList;