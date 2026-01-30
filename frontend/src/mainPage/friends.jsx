import { Container, Row, Col, Card } from "react-bootstrap";
import NavBar from "./navBar";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getFriends } from "../services/api.js";
import { useEffect, useState } from "react";
import ProfileLink from "../profile/ProfileLink.jsx";

function Friends() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try session storage first
        const cached = sessionStorage.getItem("currentUser");
        if (cached) {
          setCurrentUser(JSON.parse(cached));
        }

        const [user, friendsData] = await Promise.all([
          getCurrentUser(),
          getFriends(),
        ]);

        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
        if (friendsData) {
          setFriends(friendsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show loading while data is not ready
  if (loading || !currentUser) return <p>Loading...</p>;

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
            <ProfileLink userId={friend.id}>
              <Card
                className="h-100 shadow-sm border-0 rounded-4"
                style={{ cursor: "pointer" }}
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
            </ProfileLink>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Friends;
