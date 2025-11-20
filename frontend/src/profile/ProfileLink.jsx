import { useNavigate } from "react-router-dom";

function ProfileLink({ userId, children }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/profile/${encodeURIComponent(userId)}`);
  };

  return (
    <span
      onClick={handleClick}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      {children}
    </span>
  );
}

export default ProfileLink;
