// Dashboard: parent container for university insights pages.
// Responsibilities:
// - Load the current user (from localStorage or router state)
// - Render high-level panels and pass data/handlers to child components
// The heavy logic (reviews, filtering, matching) lives inside the child
// components so this file stays focused on layout and orchestration.
import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import NavBar from "../mainPage/navBar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import UniversityTable from "./UniversityTable";
import UniversityChartByDep from "./UniversityChartByDep.jsx";
import PedagogueTable from "./PedagogueTable.jsx";
import GuestBanner from "./GuestBanner.jsx";
import MatchingPrograms from "./MatchingPrograms.jsx";
import UniversityReviewsPanel from "./UniversityReviewsPanel.jsx";
import PedagogueReviewsPanel from "./PedagogueReviewsPanel.jsx";
import { getCurrentUser } from "../services/api.js";

function Dashboard() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  // On mount, attempt to load the currently signed-in user. We check
  // `localStorage.currentUser` first (normal login flow) and fall back to
  // `location.state.user` which may be provided when navigating as a guest.
  // Keeping this at the dashboard level allows child panels to receive
  // `currentUser` via props in future changes (or to read from storage).
  useEffect(() => {
<<<<<<< HEAD
    const fetchUser = async () => {
      // Check router state for guest user first
      if (location.state?.user) {
        setCurrentUser(location.state.user);
        return;
      }

      // Try session storage for cached user
      const cached = sessionStorage.getItem("currentUser");
      if (cached) {
        setCurrentUser(JSON.parse(cached));
      }

      // Verify with API
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
=======
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    } else if (location.state?.user) {
      setCurrentUser(location.state.user);
    }
>>>>>>> 95bf94852402ac5abb779aec3ac1be3dbd1c61c5
  }, [location.state]);

  // Note: most data handling (reviews, filtering, etc.) is implemented inside
  // the child components (UniversityReviewsPanel, PedagogueReviewsPanel,
  // MatchingPrograms). This keeps the dashboard file concise and focused on
  // layout and user-loading.

  if (!currentUser) return <p>Loading...</p>;

  const userRole = currentUser.role || "student"; // default to student for users created via sign-up
  const isGuest = userRole === "guest";
  // const isStudent = userRole === "student"; // no longer used at this level
  // No review helpers or filters required at this level anymore.

  // Render layout: left column contains ranking tables; right column shows
  // charts and program-matching. Below that we render review panels for
  // universities and pedagogues. Child components encapsulate their own
  // state and interactions for clarity and testability.
  return (
    <>
      {!isGuest && <NavBar currentUser={currentUser} />}

      <Container className="dashboard-container mt-4">
        {isGuest && <GuestBanner />}
        <Row className="align-items-center mb-3">
          <Col>
            <h1 className="dashboard-title">University Insights</h1>
            <p className="text-muted mb-0">
              Explore programs, compare universities and view ratings by study
              area.
            </p>
          </Col>
        </Row>

        <Row className="g-3">
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-2">Top Ranked Universities</Card.Title>
                <UniversityTable />
              </Card.Body>
            </Card>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Card.Title className="mb-2">Top Ranked Pedagogues</Card.Title>
                <PedagogueTable />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <UniversityChartByDep />
            <div className="mt-3" />
            <MatchingPrograms />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col lg={6} className="mb-3">
            <UniversityReviewsPanel />
          </Col>

          <Col lg={6} className="mb-3">
            <PedagogueReviewsPanel />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
