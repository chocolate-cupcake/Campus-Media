import { useNavigate } from "react-router-dom";
import Buttons from "./Buttons.jsx";
import ProfilePic from "../assets/profilePic.jpg";
import chatLogo from "../assets/chatLogo.png";
import SearchBar from "./searchBar.jsx";

function NavBar({ onOpenSuggestions, currentUser }) {
  const navigate = useNavigate();
  // defensive defaults when currentUser is not provided
  const displayImage = currentUser?.profileImage || ProfilePic;
  const displayName = currentUser?.name || "User";
  const chatCount = 2; // Example chat count
  const navItems = [
    { label: "Home", path: "/main-page" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container px-4 px-lg-5">
        {/* Profile section */}
        <div className="me-3 d-flex flex-column align-items-center">
          <Buttons
            variant="light"
            onClick={() =>
              navigate(
                currentUser ? `/profile/${currentUser.id}` : "/main-page"
              )
            }
          >
            <img
              src={displayImage}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "40px", height: "40px" }}
            />
          </Buttons>
          <span className="mt-1 text-center" style={{ fontSize: "0.8rem" }}>
            {displayName}
          </span>
        </div>

        <span
          className="navbar-brand fw-bold fs-4"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/main-page")}
        >
          Campus Media
        </span>

        {/* Mobile: open suggestions drawer (more discoverable than floating button) */}
        {onOpenSuggestions && (
          <Buttons
            variant="light"
            className="d-md-none ms-2 p-2"
            onClick={onOpenSuggestions}
            aria-label="Open suggestions"
            title="Suggestions"
          >
            {/* People / suggestions icon (inline SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M13 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0zM9 8c0 1.105.672 2 1.5 2H14v1a1 1 0 0 1-1 1h-2.5A2.5 2.5 0 0 1 8 9.5V8h1zM3 7a2 2 0 1 0 0 .001A2 2 0 0 0 3 7zm2.5 3A2.5 2.5 0 0 1 3 12.5H1a1 1 0 0 1-1-1v-1h3.5z" />
            </svg>
            <span className="visually-hidden">Suggestions</span>
          </Buttons>
        )}

        <button // Mobile toggle button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links + chat */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div>
            <SearchBar />
          </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            {/* Navigation buttons */}
            {navItems.map((item) => (
              <Buttons
                key={item.label}
                variant="light"
                className="nav-btn-custom"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Buttons>
            ))}

            {/* Chat button with badge */}
            <Buttons
              variant="light"
              onClick={() => navigate("/chat")}
              className="d-flex align-items-center justify-content-center position-relative"
            >
              <img
                src={chatLogo}
                alt="chat"
                style={{ width: "20px", height: "20px", display: "block" }}
              />
              {chatCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem" }}
                >
                  {chatCount}
                </span>
              )}
            </Buttons>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
