import { useState, useMemo, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Badge,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../mainPage/navBar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import UniversityTable from "./UniversityTable";
import UniversityChartByDep from "./UniversityChartByDep.jsx";
import PedagogueTable from "./PedagogueTable.jsx";
import universities from "./data.js";

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState("All");
  const [searchProf, setSearchProf] = useState("");
  const [reviewedUniversities, setReviewedUniversities] = useState(new Set());
  const [reviewedProfessors, setReviewedProfessors] = useState(new Set());
  const [studentUniversity, setStudentUniversity] = useState("Any");
  const [studentCourses, setStudentCourses] = useState("");
  const [matchedProfessors, setMatchedProfessors] = useState([]);

  useEffect(() => {
    // Check localStorage first (for logged-in users)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    } else if (location.state?.user) {
      // Check router state for guest user
      setCurrentUser(location.state.user);
    }
  }, [location.state]);

  // Memoized values
  const allProfessors = useMemo(() => {
    const list = [];
    universities.forEach((uni) => {
      (uni.departments || []).forEach((dept) => {
        (dept.professors || []).forEach((p) => {
          list.push({ ...p, university: uni.name, department: dept.name });
        });
      });
    });
    return list;
  }, []);

  const universityOptions = useMemo(
    () => ["Any", ...universities.map((u) => u.name)],
    []
  );

  const filteredProfessors = useMemo(() => {
    const term = searchProf.trim().toLowerCase();
    if (!term) return allProfessors;
    return allProfessors.filter((p) => {
      const full = `${p.name} ${p.surname}`.toLowerCase();
      return (
        full.includes(term) ||
        (p.courses || []).some((c) => c.toLowerCase().includes(term)) ||
        (p.researchAreas || []).some((r) => r.toLowerCase().includes(term))
      );
    });
  }, [searchProf, allProfessors]);

  const availableTypes = useMemo(() => {
    const typesSet = new Set();
    universities.forEach((uni) => {
      (uni.departments || []).forEach((dept) => {
        (dept.programs || []).forEach((prog) => {
          const progTypes = Array.isArray(prog.type)
            ? prog.type
            : prog.type
            ? [prog.type]
            : [];
          progTypes.forEach((t) => {
            if (t && t !== "All") typesSet.add(t);
          });
        });
      });
    });
    const arr = Array.from(typesSet).sort();
    return ["All", ...arr];
  }, []);

  const selectedValues = universities
    .map((uni) => {
      const departments = (uni.departments || [])
        .map((dept) => {
          const programs = (dept.programs || []).filter((program) =>
            selectedType === "All" ? true : program.type?.includes(selectedType)
          );
          return { ...dept, programs };
        })
        .filter((dept) => (dept.programs || []).length > 0);
      return { ...uni, departments };
    })
    .filter((uni) => (uni.departments || []).length > 0)
    .map((uni) => {
      const allPrograms = uni.departments.flatMap((d) => d.programs || []);
      const avgProgramRating =
        allPrograms.length > 0
          ? allPrograms.reduce((s, p) => s + (p.rating || 0), 0) /
            allPrograms.length
          : 0;
      return { ...uni, avgProgramRating };
    });

  if (!currentUser) return <p>Loading...</p>;

  const isGuest = currentUser.role === "guest";

  function calculateHierarchicalRankings(universities) {
    let sorted = [...universities].sort((a, b) => b.rating - a.rating);
    sorted = sorted.slice(0, 3);
    return sorted.map((uni, index) => ({ ...uni, rank: index + 1 }));
  }

  const findMatchesForStudent = () => {
    const terms = studentCourses
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (terms.length === 0) {
      setMatchedProfessors([]);
      return;
    }

    const matches = allProfessors.filter((p) => {
      if (studentUniversity !== "Any" && p.university !== studentUniversity)
        return false;
      const profCourses = (p.courses || []).map((c) => c.toLowerCase());
      return terms.some((t) => profCourses.some((pc) => pc.includes(t)));
    });

    setMatchedProfessors(matches);
  };

  const handleReviewUniversity = (uni) => {
    setReviewedUniversities((prev) => new Set(prev).add(uni.id));
  };

  const handleReviewProfessor = (prof) => {
    setReviewedProfessors((prev) => new Set(prev).add(prof.id));
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <>
      {!isGuest && <NavBar currentUser={currentUser} />}

      <Container className="dashboard-container mt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h1 className="dashboard-title">University Insights</h1>
            <p className="text-muted mb-0">
              Explore programs, compare universities and view ratings by study
              area.
            </p>
          </Col>
          <Col xs="auto">
            <InputGroup className="type-select">
              <Form.Select
                aria-label="Filter by program type"
                value={selectedType}
                onChange={handleTypeChange}
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Form.Select>
              <Button
                variant="outline-secondary"
                onClick={() => setSelectedType("All")}
              >
                Reset
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Row className="g-3">
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-2">
                  Top Ranked Universities
                </Card.Title>
                <UniversityTable
                  universities={calculateHierarchicalRankings(universities)}
                />
              </Card.Body>
            </Card>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Card.Title className="mb-2">Top Ranked Pedagogues</Card.Title>
                <PedagogueTable top={5} />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title>Ratings by Selected Area</Card.Title>
                <div className="mb-2">
                  {availableTypes.slice(0, 8).map((t) => (
                    <Badge
                      key={t}
                      pill
                      bg={t === selectedType ? "primary" : "light"}
                      text={t === selectedType ? undefined : "dark"}
                      className="me-2 type-badge"
                      onClick={() => setSelectedType(t)}
                      style={{ cursor: "pointer" }}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>

                <UniversityChartByDep
                  areaOfStudy={selectedType}
                  universityData={selectedValues}
                />
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Matching Programs</Card.Title>
                {selectedValues.length > 0 ? (
                  selectedValues.map((uni) => (
                    <div className="mb-3" key={uni.id}>
                      <h6 className="mb-1">{uni.name}</h6>
                      <div className="program-list">
                        {uni.departments
                          .flatMap((d) => d.programs)
                          .map((p) => (
                            <Card key={p.id} className="program-card me-2 mb-2">
                              <Card.Body className="p-2">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <div className="program-name">{p.name}</div>
                                    <div className="text-muted small">
                                      {p.degree} • {p.language} • {p.credits} cr
                                    </div>
                                  </div>
                                  <Badge
                                    bg="success"
                                    className="program-rating"
                                  >
                                    {p.rating}
                                  </Badge>
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    No programs found for the selected type.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col lg={6} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>University Ratings & Reviews</Card.Title>
                <p className="text-muted small">
                  See which universities have ratings and add a review.
                </p>
                <div className="list-group">
                  {universities.map((uni) => (
                    <div
                      key={uni.id}
                      className="d-flex justify-content-between align-items-center py-2 border-bottom"
                    >
                      <div>
                        <strong>{uni.name}</strong>
                        <div className="text-muted small">
                          Rating: {uni.rating}
                        </div>
                      </div>
                      <div>
                        {reviewedUniversities.has(uni.id) ? (
                          <Badge bg="success">Reviewed</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleReviewUniversity(uni)}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Pedagogue Reviews</Card.Title>
                <Form className="mb-3">
                  <Row className="g-2">
                    <Col sm={5}>
                      <Form.Select
                        value={studentUniversity}
                        onChange={(e) => setStudentUniversity(e.target.value)}
                      >
                        {universityOptions.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col sm={5}>
                      <Form.Control
                        placeholder="Enter courses student has taken (comma separated)"
                        value={studentCourses}
                        onChange={(e) => setStudentCourses(e.target.value)}
                      />
                    </Col>
                    <Col sm={2} className="d-grid">
                      <Button variant="primary" onClick={findMatchesForStudent}>
                        Find
                      </Button>
                    </Col>
                  </Row>
                </Form>

                {studentCourses.trim() && (
                  <div className="mb-2">
                    <small className="text-muted">
                      Showing matches for student at{" "}
                      <strong>{studentUniversity}</strong> (courses:{" "}
                      {studentCourses})
                    </small>
                  </div>
                )}

                <PedagogueTable
                  top={50}
                  professors={
                    studentCourses.trim()
                      ? matchedProfessors
                      : filteredProfessors
                  }
                  onReview={handleReviewProfessor}
                  reviewedIds={reviewedProfessors}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {isGuest && (
        <div className="text-center mt-5 mb-4">
          <h5>Enjoying the preview? 🎓</h5>
          <Button variant="primary" size="lg" onClick={() => navigate("/")}>
            Sign Up to Unlock Full Access
          </Button>
        </div>
      )}
    </>
  );
}

export default Dashboard;
