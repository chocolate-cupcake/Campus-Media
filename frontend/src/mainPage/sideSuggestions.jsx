import { useState } from "react";
import {
  ListGroup,
  Image,
  Button,
  ButtonGroup,
  Breadcrumb,
  Toast,
  Offcanvas,
} from "react-bootstrap";
import { students } from "./studentData.js"; // ✅ import your real data

function SideSuggestions({ showOffcanvas, closeOffcanvas }) {
  // Simulated logged-in user
  const currentUser = students.find((student) => student.id === 1);

  // Get real suggestions for this user
  const suggestions = students.filter((student) =>
    currentUser.suggestions.includes(student.id)
  );

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function handleAdd(username) {
    setToastMessage(`✅ You added ${username} as a friend`);
    setShowToast(true);
  }

  function handleRemove(username) {
    setToastMessage(`❌ You removed ${username} from suggestions`);
    setShowToast(true);
  }

  return (
    <>
      {/* Offcanvas for mobile */}
      <Offcanvas show={!!showOffcanvas} onHide={closeOffcanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Suggestions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {suggestions.map((s) => (
              <ListGroup.Item
                key={s.id}
                className="d-flex align-items-center justify-content-between"
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
                      handleAdd(s.name);
                      closeOffcanvas();
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleRemove(s.name);
                      closeOffcanvas();
                    }}
                  >
                    -
                  </Button>
                </ButtonGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Breadcrumb className="mt-3">
            <Breadcrumb.Item href="/friends">
              Check your Friends
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/dashboard">
              Do your rating 🌟
            </Breadcrumb.Item>
          </Breadcrumb>
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
        }}
      >
        <h5>Suggestions</h5>
        <ListGroup>
          {suggestions.map((s) => (
            <ListGroup.Item
              key={s.id}
              className="d-flex align-items-center justify-content-between"
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
                <Button variant="primary" onClick={() => handleAdd(s.name)}>
                  Add
                </Button>
                <Button variant="danger" onClick={() => handleRemove(s.name)}>
                  -
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Breadcrumb>
          <Breadcrumb.Item href="/friends">Check your Friends</Breadcrumb.Item>
          <Breadcrumb.Item href="/dashboard">Do your rating 🌟</Breadcrumb.Item>
        </Breadcrumb>

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
