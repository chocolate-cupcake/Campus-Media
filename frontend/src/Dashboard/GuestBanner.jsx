import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// GuestBanner
// - Simple presentational component shown to unauthenticated users.
// - Encourages guests to sign up or log in; contains navigation CTA only.
export default function GuestBanner() {
  const navigate = useNavigate();
  const show = useMemo(() => {
    const hide = sessionStorage.getItem("hideGuestBanner") === "1";
    if (hide) return false;
    try {
      const user = JSON.parse(sessionStorage.getItem("currentUser"));
      const role = user?.role || "student";
      return role === "guest";
    } catch {
      return false;
    }
  }, []);

  if (!show) return null;

  return (
    <Row className="mb-3">
      <Col>
        <Card className="shadow-sm text-center">
          <Card.Body>
            <Card.Title>You're browsing as a guest</Card.Title>
            <Card.Text className="text-muted">
              Sign up or log in to leave reviews, follow universities and get
              personalized recommendations.
            </Card.Text>
            <div className="d-flex justify-content-center gap-2">
              <Button variant="primary" onClick={() => navigate("/logIn")}>
                Sign up / Log in
              </Button>
            
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
