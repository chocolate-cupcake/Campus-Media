import { Container, Row, Col, Card } from "react-bootstrap";
import NavBar from "./navBar";
import { useNavigate } from "react-router-dom";
import { getStudents } from "./studentData.js";
import { useEffect, useState } from "react";

function Friends() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    } else {
      // optionally redirect if not logged in
      // navigate("/login");
    }
  }, []);

  // Show loading while currentUser is not ready
  if (!currentUser) return <p>Loading...</p>;

  // Full friend objects
  const students = getStudents();

  // Full friend objects
  const friends = students.filter((student) =>
    currentUser.friends?.includes(student.id)
  );

  return (
    <Container className="py-5">
      <NavBar currentUser={currentUser} /> {/* ✅ pass currentUser */}
      <Row>
        <div className="d-flex align-items-center justify-content-center mb-4">
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="me-2 rounded-circle"
            style={{ width: "32px", height: "32px", objectFit: "cover" }}
          />
          <h2 className="mb-0 fw-bold">{currentUser.name}'s Friends</h2>
        </div>
      </Row>
      <Row className="g-4">
        {friends.map((friend) => (
          <Col key={friend.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              className="h-100 shadow-sm border-0 rounded-4"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/profile?id=${encodeURIComponent(friend.id)}`)
              }
            >
              <Card.Img
                variant="top"
                src={friend.profileImage}
                alt={friend.name}
                className="rounded-top-4"
                style={{ objectFit: "cover", height: "220px" }}
              />
              <Card.Body className="text-center">
                <Card.Title className="fw-semibold">{friend.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Friends;
