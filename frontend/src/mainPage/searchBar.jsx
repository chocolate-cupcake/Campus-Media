import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { globalSearch } from "../services/api.js";
import SearchResultsModal from "./searchResultsModal.jsx";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await globalSearch(query.trim());
      // Handle the search results - assuming API returns { users, universities, programs }
      const filtered = searchResults.users || searchResults || [];
      setResults(filtered);
      setShowModal(true);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                fontWeight: "500",
                borderRadius: "20px",
                padding: "6px 15px",
              }}
            >
              {loading ? "..." : "Search"}
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
