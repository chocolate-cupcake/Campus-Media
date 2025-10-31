import React from "react";

function Message({ text, isOwn }) {
  return (
    <div className={`d-flex ${isOwn ? 'justify-content-end' : 'justify-content-start'}`} style={{ marginBottom: "10px" }}>
      <div 
        className="px-3 py-2"
        style={{
          maxWidth: "70%",
          borderRadius: "8px",
          backgroundColor: isOwn ? "#DCF8C6" : "#FFFFFF",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
        }}
      >
        <span className={isOwn ? 'text-end' : 'text-start'} style={{ wordBreak: "break-word" }}>
          {text}
        </span>
      </div>
    </div>
  );
}

export default Message;