import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

export default function GuestBanner({ show, onSignIn}) {
  if (!show) return null;
  return (
    <Row className="mb-3">
      <Col>
        <Card className="shadow-sm text-center">
          <Card.Body>
            <Card.Title>You're browsing as a guest</Card.Title>
            <Card.Text className="text-muted">
              Sign up or log in to leave reviews, follow universities and get personalized recommendations.
            </Card.Text>
            <div className="d-flex justify-content-center gap-2">
              <Button variant="primary" onClick={onSignIn}>Sign up / Log in</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
