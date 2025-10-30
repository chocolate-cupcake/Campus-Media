function Message({ text, isOwn }) {
  return (
    <div style={{ textAlign: isOwn ? "right" : "left", margin: "5px 0" }}>
      <span style={{
        display: "inline-block",
        padding: "8px 12px",
        borderRadius: "15px",
        backgroundColor: isOwn ? "#DCF8C6" : "#F0F0F0"
      }}>
        {text}
      </span>
    </div>
  );
}

export default Message;