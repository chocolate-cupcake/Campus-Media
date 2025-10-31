import { Container, Row, Col, Card } from "react-bootstrap";
import emilyImg from "../assets/emily.jpg";
import danielImg from "../assets/daniel.jpg";
import sophiaImg from "../assets/sophia.jpg";
import liamImg from "../assets/liam.jpg";
import avaImg from "../assets/ava.jpg";
import ethanImg from "../assets/ethan.jpg";
import oliviaImg from "../assets/olivia.jpg";
import noahImg from "../assets/noah.jpg";
import chloeImg from "../assets/chloe.jpg";
import lucasImg from "../assets/lucas.jpg";
import NavBar from "./NavBar";
import useNavigate from "react-router-dom";

function Friends() {
  const friends = [
    {
      username: "Emily Carter",
      email: "emily.carter@university.edu",
      image: emilyImg,
    },
    {
      username: "Daniel Harris",
      email: "daniel.harris@university.edu",
      image: danielImg,
    },
    {
      username: "Sophia Nguyen",
      email: "sophia.nguyen@university.edu",
      image: sophiaImg,
    },
    {
      username: "Liam Patel",
      email: "liam.patel@university.edu",
      image: liamImg,
    },
    {
      username: "Ava Robinson",
      email: "ava.robinson@university.edu",
      image: avaImg,
    },
    {
      username: "Ethan Kim",
      email: "ethan.kim@university.edu",
      image: ethanImg,
    },
    {
      username: "Olivia Martinez",
      email: "olivia.martinez@university.edu",
      image: oliviaImg,
    },
    {
      username: "Noah Thompson",
      email: "noah.thompson@university.edu",
      image: noahImg,
    },
    {
      username: "Chloe Anderson",
      email: "chloe.anderson@university.edu",
      image: chloeImg,
    },
    {
      username: "Lucas Wright",
      email: "lucas.wright@university.edu",
      image: lucasImg,
    },
  ];

  const navigate = useNavigate();
  return (
    <Container className="py-5">
      <NavBar />
      <Row>
        <div className="d-flex align-items-center justify-content-center mb-4">
          <img
            src={avaImg}
            alt="friends"
            className="me-2 rounded-circle"
            style={{ width: "24px", height: "24px", objectFit: "cover" }}
          />
          <h2 className="mb-0 fw-bold">Community</h2>
        </div>
      </Row>
      <Row className="g-4">
        {friends.map((friend) => (
          <Col key={friend.username} xs={12} sm={6} md={4} lg={3}>
            <Card
              className="h-100 shadow-sm border-0 rounded-4"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(
                  `/profile?username=${encodeURIComponent(friend.username)}`
                )
              }
            >
              <Card.Img
                variant="top"
                src={friend.image}
                alt={friend.username}
                className="rounded-top-4"
                style={{
                  objectFit: "cover",
                  height: "220px",
                }}
              />
              <Card.Body className="text-center">
                <Card.Title className="fw-semibold">
                  {friend.username}
                </Card.Title>
                <Card.Text
                  className="text-muted"
                  style={{ fontSize: "0.9rem" }}
                >
                  {friend.email}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Friends;
