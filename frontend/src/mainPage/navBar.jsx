import { useNavigate } from "react-router-dom";
import Buttons from "./Buttons.jsx";
import ProfilePic from "../assets/profilePic.jpg";
import chatLogo from "../assets/chatLogo.png";
import SearchBar from "./searchBar.jsx";

function NavBar() {
  const navigate = useNavigate();
  const chatCount = 2; // Example chat count
  const navItems = [
    { label: "Home", path: "/main-page" },
    { label: "University", path: "/university-page" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container px-4 px-lg-5">

        {/* Profile section */}
        <div className="me-3 d-flex flex-column align-items-center">
          <Buttons variant="light" onClick={() => navigate("/profile")}>
            <img
              src={ProfilePic}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "40px", height: "40px" }}
            />
          </Buttons>
          <span className="mt-1 text-center" style={{ fontSize: "0.8rem" }}>
            John Doe
          </span>
        </div>

        
        <span
          className="navbar-brand fw-bold fs-4"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/main-page")}
        >
          Campus Media
        </span>

       
        <button  // Mobile toggle button 
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
            <SearchBar/>
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
