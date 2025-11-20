import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import ProfileLink from "../profile/ProfileLink.jsx"; // make sure path is correct

function SearchResultsModal({ results, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200); // match fade-out duration
  };

  return (
    <div
      className={`search-modal ${visible ? "fade-in" : "fade-out"}`}
      onClick={handleClose}
    >
      <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
        {results.length === 0 ? (
          <p className="no-results">No students found</p>
        ) : (
          <div className="search-grid">
            {results.map((student) => (
              <ProfileLink key={student.id} userId={student.id}>
                <Card className="search-card">
                  <Card.Img
                    variant="top"
                    src={student.profileImage}
                    alt={student.name}
                    className="search-card-img"
                  />
                  <Card.Body className="search-card-body">
                    <Card.Title className="search-card-title">{student.name}</Card.Title>
                    <Card.Text className="search-card-text">
                      {student.university} - {student.department}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </ProfileLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsModal;
