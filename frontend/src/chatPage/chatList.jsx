import React from "react";

function ChatList({ users, onSelect, selectedUser }) {
  return (
    <div className="border-end" style={{ width: "400px", height: "100%", overflowY: "auto", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
      <div className="p-3 border-bottom" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
        <h5 className="mb-0 fw-bold">Messages</h5>
      </div>
      {users.map(user => (
        <div
          key={user.id}
          className={`d-flex align-items-center p-3 border-bottom ${selectedUser?.id === user.id ? 'bg-primary bg-opacity-20' : ''}`}
          style={{ cursor: "pointer", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          onClick={() => onSelect(user)}
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
        </div>
      ))}
    </div>
  );
}

export default ChatList;