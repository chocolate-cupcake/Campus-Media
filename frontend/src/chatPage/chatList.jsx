function ChatList({ users, onSelect }) {
  return (
    <div style={{ width: "250px", borderRight: "1px solid #ccc", height: "100%" }}>
      {users.map(user => (
        <div
          key={user.id}
          style={{ padding: "10px", cursor: "pointer" }}
          onClick={() => onSelect(user)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default ChatList;