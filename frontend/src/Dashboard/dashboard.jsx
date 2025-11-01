import React, { useState, useMemo } from "react";
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
import NavBar from "../mainPage/navBar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import UniversityTable from "./UniversityTable";
import UniversityChartByDep from "./UniversityChartByDep.jsx";
import universities from "./data.js";

function Dashboard() {

  function calculateHierarchicalRankings(universities) {
    // Sort universities by their rating in descending order
    let sorted = [...universities].sort((a, b) => b.rating - a.rating);
    sorted = sorted.slice(0, 3);
    // Assign rankings based on the sorted order
    return sorted.map((uni, index) => ({ ...uni, rank: index + 1 }));
  }

  


  const [selectedType, setSelectedType] = useState("All");

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // derive available types dynamically from the programs data
  const availableTypes = useMemo(() => {
    const typesSet = new Set();
    universities.forEach((uni) => {
      (uni.departments || []).forEach((dept) => {
        (dept.programs || []).forEach((prog) => {
          (prog.type || []).forEach((t) => typesSet.add(t));
        });
        (dept.type || []).forEach((t) => typesSet.add(t));
      });
      (uni.type || []).forEach((t) => typesSet.add(t));
    });
    // ensure 'All' is present and put it first
    const arr = Array.from(typesSet).filter((t) => t && t !== "All");
    arr.sort();
    return ["All", ...arr];
  }, []);

  // Build a filtered view of universities where programs match the selectedType.
  // Resulting shape: an array of universities with departments that only include matching programs.
  const selectedValues = universities
    .map((uni) => {
      const departments = (uni.departments || [])
        .map((dept) => {
          const programs = (dept.programs || []).filter((program) =>
            selectedType === "All" ? true : program.type?.includes(selectedType)
          );

          return { ...dept, programs };
        })
        // drop departments with no matching programs
        .filter((dept) => (dept.programs || []).length > 0);

      return { ...uni, departments };
    })
    // drop universities with no matching departments/programs
    .filter((uni) => (uni.departments || []).length > 0)
    // compute an average program rating per university (useful for charts)
    .map((uni) => {
      const allPrograms = uni.departments.flatMap((d) => d.programs || []);
      const avgProgramRating =
        allPrograms.length > 0
          ? allPrograms.reduce((s, p) => s + (p.rating || 0), 0) /
            allPrograms.length
          : 0;
      return { ...uni, avgProgramRating };
    });

  return (
    <>
      <NavBar />
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
      </Container>
    </>
  );
}

export default Dashboard;
