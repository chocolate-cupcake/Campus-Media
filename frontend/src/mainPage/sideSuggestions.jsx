import { useState, useEffect } from "react";
import {
  ListGroup,
  Image,
  Button,
  ButtonGroup,
  Breadcrumb,
  Toast,
  Offcanvas,
} from "react-bootstrap";
import {
  getSuggestions,
  sendFriendRequest,
  dismissSuggestion,
  getCurrentUser,
} from "../services/api.js";
import { useNavigate, Navigate } from "react-router-dom";

function SideSuggestions({ showOffcanvas, closeOffcanvas }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Load current user and suggestions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try session storage first
        const cached = sessionStorage.getItem("currentUser");
        if (cached) {
          setCurrentUser(JSON.parse(cached));
        }

        const [user, suggestionsData] = await Promise.all([
          getCurrentUser(),
          getSuggestions(),
        ]);

        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
        if (suggestionsData) {
          setSuggestions(suggestionsData);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchData();
  }, []);

  async function handleAdd(suggestionId, suggestionName) {
    if (!currentUser) return;

    try {
      await sendFriendRequest(suggestionId);

      // Update local state - remove from suggestions
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));

      setToastMessage(`✅ Friend request sent to ${suggestionName}`);
      setShowToast(true);
    } catch (error) {
      console.error("Failed to send friend request:", error);
      setToastMessage(`❌ Failed to send request to ${suggestionName}`);
      setShowToast(true);
    }
  }

  async function handleRemove(suggestionId, suggestionName) {
    if (!currentUser) return;

    try {
      await dismissSuggestion(suggestionId);

      // Update local state
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));

      const updatedUser = {
        ...currentUser,
        suggestions: currentUser.suggestions.filter(
          (id) => id !== suggestionId,
        ),
      };

      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setToastMessage(`❌ You removed ${suggestionName} from suggestions`);
      setShowToast(true);
    } catch (error) {
      console.error("Failed to remove suggestion:", error);
    }
  }

  // Show loading until currentUser is ready
  if (!currentUser) return <p>Loading suggestions...</p>;

  return (
    <>
      {/* Offcanvas for mobile */}
      <Offcanvas
        show={!!showOffcanvas}
        onHide={closeOffcanvas}
        placement="end"
        style={{
          backgroundColor: "#E8F1FF",
        }}
      >
        <Offcanvas.Header
          closeButton
          style={{ backgroundColor: "#4A90E2", borderBottom: "none" }}
        >
          <Offcanvas.Title style={{ color: "#ffffff", fontWeight: "600" }}>
            Suggestions
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ backgroundColor: "#E8F1FF" }}>
          <ListGroup>
            {suggestions.map((s) => (
              <ListGroup.Item
                key={s.id}
                className="d-flex align-items-center justify-content-between"
                style={{
                  backgroundColor: "#F5FAFF",
                  border: "1px solid #B8D4F1",
                  color: "#2C5AA0",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src={s.profileImage}
                    roundedCircle
                    width={30}
                    height={30}
                  />
                  <span>{s.name}</span>
                </div>
                <ButtonGroup size="sm">
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleAdd(s.id, s.name);
                      closeOffcanvas();
                    }}
                    style={{ backgroundColor: "#4A90E2", border: "none" }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleRemove(s.id, s.name);
                      closeOffcanvas();
                    }}
                    style={{ backgroundColor: "#E85D5D", border: "none" }}
                  >
                    -
                  </Button>
                </ButtonGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <ul
            className="list-group list-group-flush"
            style={{ backgroundColor: "#E8F1FF" }}
          >
            <li
              className="list-group-item friend-item"
              style={{
                backgroundColor: "#F5FAFF",
                border: "1px solid #B8D4F1",
                color: "#2C5AA0",
                fontWeight: "500",
              }}
              onClick={() => {
                navigate("/friends");
              }}
            >
              Check your Friends 🧑‍🤝‍🧑
            </li>
            <li
              className="list-group-item friend-item"
              style={{
                backgroundColor: "#F5FAFF",
                border: "1px solid #B8D4F1",
                color: "#2C5AA0",
                fontWeight: "500",
              }}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Make a review ⭐
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop sidebar */}
      <aside
        className="bg-light p-3 d-none d-md-block"
        style={{
          width: "350px",
          position: "sticky",
          top: 0,
          maxHeight: "100vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #E8F1FF 0%, #D4E8FF 100%)",
          borderRight: "3px solid #4A90E2",
          boxShadow: "2px 0 8px rgba(74, 144, 226, 0.1)",
        }}
      >
        <h5
          style={{
            color: "#2C5AA0",
            fontWeight: "700",
            marginBottom: "20px",
            fontSize: "1.3rem",
          }}
        >
          💡 Suggestions
        </h5>
        <ListGroup>
          {suggestions.map((s) => (
            <ListGroup.Item
              key={s.id}
              className="d-flex align-items-center justify-content-between"
              style={{
                background: "linear-gradient(135deg, #F5FAFF 0%, #E8F1FF 100%)",
                border: "2px solid #B8D4F1",
                color: "#2C5AA0",
                marginBottom: "10px",
                transition: "all 0.3s ease",
                borderRadius: "12px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #B8D4F1 0%, #A0C8E8 100%)";
                e.currentTarget.style.transform = "translateX(5px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(74, 144, 226, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #F5FAFF 0%, #E8F1FF 100%)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Image
                  src={s.profileImage}
                  roundedCircle
                  width={30}
                  height={30}
                />
                <span style={{ fontWeight: "500" }}>{s.name}</span>
              </div>
              <ButtonGroup size="sm">
                <Button
                  variant="primary"
                  onClick={() => handleAdd(s.id, s.name)}
                  style={{
                    backgroundColor: "#4A90E2",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleRemove(s.id, s.name)}
                  style={{ backgroundColor: "#E85D5D", border: "none" }}
                >
                  -
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <ul
          className="list-group list-group-flush"
          style={{ backgroundColor: "transparent", marginTop: "20px" }}
        >
          <li
            className="list-group-item friend-item"
            style={{
              background: "linear-gradient(135deg, #F5FAFF 0%, #E8F1FF 100%)",
              border: "2px solid #4A90E2",
              color: "#2C5AA0",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginBottom: "10px",
              borderRadius: "12px",
            }}
            onClick={() => {
              navigate("/friends");
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateX(5px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(74, 144, 226, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #F5FAFF 0%, #E8F1FF 100%)";
              e.currentTarget.style.color = "#2C5AA0";
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Check your Friends 🧑‍🤝‍🧑
          </li>
          <li
            className="list-group-item friend-item"
            style={{
              background: "linear-gradient(135deg, #F5FAFF 0%, #E8F1FF 100%)",
              border: "2px solid #4A90E2",
              color: "#2C5AA0",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "12px",
            }}
            onClick={() => {
              navigate("/dashboard");
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateX(5px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(74, 144, 226, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #F5FAFF 0%, #E8F1FF 100%)";
              e.currentTarget.style.color = "#2C5AA0";
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Make a review ⭐
          </li>
        </ul>

        {/* Toast */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="position-relative"
          style={{ zIndex: 9999 }}
        >
          <div className="toast-container position-absolute bottom-0 end-0 p-3">
            <Toast
              bg="light"
              show={showToast}
              onClose={() => setShowToast(false)}
              delay={2500}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">Notification</strong>
                <small>Just now</small>
              </Toast.Header>
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideSuggestions;
