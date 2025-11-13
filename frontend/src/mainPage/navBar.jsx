import { useNavigate } from "react-router-dom";
import Buttons from "./Buttons.jsx";
import ProfilePic from "../assets/profilePic.jpg";
import chatLogo from "../assets/chatLogo.png";
import SearchBar from "./searchBar.jsx";
import { FaUsers } from "react-icons/fa";

function NavBar({ onOpenSuggestions, currentUser }) {
  const navigate = useNavigate();

  // ✅ Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/logIn");
    window.location.reload(); // ensures clean state
  };

  // ✅ Display defaults if user not logged in
  const displayImage = currentUser?.profileImage || ProfilePic;
  const displayName = currentUser?.name || "User";
  const chatCount = 2; // Example chat count

  const navItems = [
    { label: "Home", path: "/main-page" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Sign Out", path: "/logIn" },
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

        {/* Brand name */}
        <span
          className="navbar-brand fw-bold fs-4"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/main-page")}
        >
          Campus Media
        </span>

        {/* Mobile suggestions button */}
        {onOpenSuggestions && (
          <Buttons
            variant="light"
            className="d-md-none ms-2 p-2"
            onClick={onOpenSuggestions}
            aria-label="Open suggestions"
            title="Suggestions"
          >
            <FaUsers size={20} />
            <span className="visually-hidden">Suggestions</span>
          </Buttons>
        )}

        {/* Navbar toggle (mobile) */}
        <button
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

        {/* Nav links and chat icon */}
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
                onClick={() => {
                  if (item.label === "Sign Out") handleSignOut();
                  else navigate(item.path);
                }}
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
