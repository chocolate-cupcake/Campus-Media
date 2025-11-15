import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { students } from "./studentData.js";
import SearchResultsModal from "./searchResultsModal.jsx";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const regex = new RegExp(`\\b${query.trim()}\\b`, "i"); // word boundary, case-insensitive
    const filtered = students.filter(
      (s) =>
        regex.test(s.name) ||
        regex.test(s.university) ||
        regex.test(s.department)
    );

    setResults(filtered);
    setShowModal(true);
  };

  const handleClickProfile = (id) => {
    navigate(`/profile?id=${encodeURIComponent(id)}`);
    setShowModal(false);
  };

  return (
    <div>
      <Form className="d-flex align-items-center" onSubmit={handleSearch}>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search students"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
                borderRadius: "20px",
                padding: "8px 15px",
                transition: "all 0.3s ease",
              }}
            />
          </Col>
          <Col xs="auto">
            <Button
              type="submit"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                fontWeight: "500",
                borderRadius: "20px",
                padding: "6px 15px",
              }}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {showModal && (
        <SearchResultsModal
          results={results}
          onClickProfile={handleClickProfile}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default SearchBar;
