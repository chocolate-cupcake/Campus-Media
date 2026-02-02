import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { globalSearch, getCurrentUser } from "../services/api.js";
import SearchResultsModal from "./searchResultsModal.jsx";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cached = sessionStorage.getItem("currentUser");
    if (cached) {
      setCurrentUser(JSON.parse(cached));
    } else {
      getCurrentUser().then(setCurrentUser).catch(console.error);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await globalSearch(query.trim());
      console.log("Search results:", searchResults);
      // Handle the search results - API returns { Users, Universities, Programs } (capital letters from C#)
      const filtered =
        searchResults.users || searchResults.Users || searchResults || [];
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
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default SearchBar;
