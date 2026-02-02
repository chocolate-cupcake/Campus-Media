import { Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import ProfileLink from "../profile/ProfileLink.jsx";
import {
  sendFriendRequest,
  getFriendRequestStatus,
  cancelFriendRequest,
} from "../services/api.js";

function SearchResultsModal({ results, onClose, currentUser }) {
  const [visible, setVisible] = useState(false);
  const [friendStatuses, setFriendStatuses] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    setVisible(true);
    // Fetch friend status for each result
    const fetchStatuses = async () => {
      const statuses = {};
      for (const student of results) {
        if (student.id !== currentUser?.id) {
          try {
            const status = await getFriendRequestStatus(student.id);
            statuses[student.id] = status?.status || status;
          } catch {
            statuses[student.id] = null;
          }
        }
      }
      setFriendStatuses(statuses);
    };
    if (currentUser) fetchStatuses();
  }, [results, currentUser]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSendRequest = async (e, studentId) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading((prev) => ({ ...prev, [studentId]: true }));
    try {
      await sendFriendRequest(studentId);
      setFriendStatuses((prev) => ({ ...prev, [studentId]: "sent" }));
    } catch (error) {
      console.error("Failed to send request:", error);
      alert(error.message || "Failed to send friend request");
    } finally {
      setLoading((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const handleCancelRequest = async (e, studentId) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading((prev) => ({ ...prev, [studentId]: true }));
    try {
      // Need to get request ID - for now just update status
      // This would need the request ID from getSentFriendRequests
      setFriendStatuses((prev) => ({ ...prev, [studentId]: null }));
    } catch (error) {
      console.error("Failed to cancel request:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const getButtonForStatus = (student) => {
    if (student.id === currentUser?.id) return null;

    const status = friendStatuses[student.id];

    if (status === "friends") {
      return (
        <Button variant="secondary" size="sm" disabled className="mt-2">
          ✓ Friends
        </Button>
      );
    }

    if (status === "sent") {
      return (
        <Button variant="outline-secondary" size="sm" className="mt-2" disabled>
          Request Sent
        </Button>
      );
    }

    if (status === "received") {
      return (
        <Button variant="info" size="sm" className="mt-2" disabled>
          Respond to Request
        </Button>
      );
    }

    return (
      <Button
        variant="primary"
        size="sm"
        className="mt-2"
        onClick={(e) => handleSendRequest(e, student.id)}
        disabled={loading[student.id]}
      >
        {loading[student.id] ? "..." : "Add Friend"}
      </Button>
    );
  };

  return (
    <div
      className={`search-modal ${visible ? "fade-in" : "fade-out"}`}
      onClick={handleClose}
    >
      <div
        className="search-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {results.length === 0 ? (
          <p className="no-results">No students found</p>
        ) : (
          <div className="search-grid">
            {results.map((student) => (
              <Card key={student.id} className="search-card">
                <ProfileLink userId={student.id}>
                  <Card.Img
                    variant="top"
                    src={student.profileImage}
                    alt={student.name}
                    className="search-card-img"
                  />
                  <Card.Body className="search-card-body">
                    <Card.Title className="search-card-title">
                      {student.name}
                    </Card.Title>
                    <Card.Text className="search-card-text">
                      {student.university} - {student.department}
                    </Card.Text>
                  </Card.Body>
                </ProfileLink>
                <div className="text-center pb-2">
                  {getButtonForStatus(student)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsModal;
