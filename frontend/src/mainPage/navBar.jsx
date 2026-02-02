import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Buttons from "./Buttons.jsx";
import ProfilePic from "../assets/profilePic.jpg";
import chatLogo from "../assets/chatLogo.png";
import SearchBar from "./searchBar.jsx";
import { FaUsers, FaBell, FaUserPlus, FaCheck, FaTimes } from "react-icons/fa";
import ProfileLink from "../profile/ProfileLink.jsx";
import {
  logout,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/api.js";

function NavBar({ onOpenSuggestions, currentUser }) {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState({});
  const dropdownRef = useRef(null);

  // Fetch pending friend requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getPendingFriendRequests();
        setPendingRequests(requests || []);
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
      }
    };
    if (currentUser) {
      fetchRequests();
      // Poll every 30 seconds for new requests
      const interval = setInterval(fetchRequests, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRequestsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAcceptRequest = async (requestId) => {
    setLoadingRequest((prev) => ({ ...prev, [requestId]: "accept" }));
    try {
      await acceptFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept friend request");
    } finally {
      setLoadingRequest((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const handleRejectRequest = async (requestId) => {
    setLoadingRequest((prev) => ({ ...prev, [requestId]: "reject" }));
    try {
      await rejectFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Failed to reject friend request");
    } finally {
      setLoadingRequest((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  // ✅ Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("currentUser");
      navigate("/logIn");
      window.location.reload(); // ensures clean state
    }
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
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm"
      style={{
        background: "linear-gradient(90deg, #4A90E2 0%, #357ABD 100%)",
        boxShadow: "0 4px 12px rgba(74, 144, 226, 0.15)",
      }}
    >
      <div className="container px-4 px-lg-5">
        {/* Profile section */}
        <div className="me-3 d-flex flex-column align-items-center">
          <ProfileLink userId={currentUser?.id}>
            <img
              src={displayImage}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "40px", height: "40px" }}
            />
          </ProfileLink>

          <span
            className="mt-1 text-center"
            style={{ fontSize: "0.8rem", color: "#ffffff" }}
          >
            {displayName}
          </span>
        </div>

        {/* Brand name */}
        <span
          className="navbar-brand fw-bold fs-4"
          style={{
            cursor: "pointer",
            color: "#ffffff",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
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
            style={{
              color: "#ffffff",
            }}
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
                style={{
                  color: "#ffffff",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  padding: "8px 16px",
                  margin: "0 8px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
                {item.label}
              </Buttons>
            ))}

            {/* Friend Requests Bell */}
            <div className="position-relative" ref={dropdownRef}>
              <Buttons
                variant="light"
                onClick={() => setShowRequestsDropdown(!showRequestsDropdown)}
                className="d-flex align-items-center justify-content-center position-relative"
                style={{
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  padding: "8px 16px",
                  margin: "0 8px",
                }}
              >
                <FaBell size={20} />
                {pendingRequests.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {pendingRequests.length}
                  </span>
                )}
              </Buttons>

              {/* Dropdown */}
              {showRequestsDropdown && (
                <div
                  className="position-absolute bg-white rounded shadow-lg"
                  style={{
                    top: "100%",
                    right: 0,
                    minWidth: "300px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    zIndex: 1050,
                    marginTop: "8px",
                  }}
                >
                  <div className="p-3 border-bottom">
                    <h6 className="mb-0 d-flex align-items-center gap-2">
                      <FaUserPlus /> Friend Requests
                    </h6>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                      No pending friend requests
                    </div>
                  ) : (
                    <div>
                      {pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="p-3 border-bottom d-flex align-items-center gap-3"
                        >
                          <img
                            src={request.senderProfileImage || ProfilePic}
                            alt={request.senderName}
                            className="rounded-circle"
                            style={{
                              width: "45px",
                              height: "45px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-semibold">
                              {request.senderName}
                            </div>
                            <small className="text-muted">
                              wants to be your friend
                            </small>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              disabled={loadingRequest[request.id]}
                              title="Accept"
                            >
                              {loadingRequest[request.id] === "accept" ? (
                                "..."
                              ) : (
                                <FaCheck />
                              )}
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRejectRequest(request.id)}
                              disabled={loadingRequest[request.id]}
                              title="Reject"
                            >
                              {loadingRequest[request.id] === "reject" ? (
                                "..."
                              ) : (
                                <FaTimes />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat button with badge */}
            <Buttons
              variant="light"
              onClick={() => navigate("/chat")}
              className="d-flex align-items-center justify-content-center position-relative"
              style={{
                color: "#ffffff",
                transition: "all 0.3s ease",
                padding: "8px 16px",
                margin: "0 8px",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
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
