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

function Dashboard() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check localStorage first (for logged-in users)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    } else if (location.state?.user) {
      // Check router state for guest user
      setCurrentUser(location.state.user);
    }
  }, [location.state]);

  // No dashboard-level data/filters needed anymore. Child components are self-contained.

  if (!currentUser) return <p>Loading...</p>;

  const userRole = currentUser.role || "student"; // default to student for users created via sign-up
  const isGuest = userRole === "guest";
  // const isStudent = userRole === "student"; // no longer used at this level
  // No review helpers or filters required at this level anymore.

  return (
    <>
      {!isGuest && <NavBar currentUser={currentUser} />}

      <Container className="dashboard-container mt-4">
        <GuestBanner />
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
                <Card.Title className="mb-2">
                  Top Ranked Universities
                </Card.Title>
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
