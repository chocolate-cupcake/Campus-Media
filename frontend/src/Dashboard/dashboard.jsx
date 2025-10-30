import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from "../mainPage/navBar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import UniversityTable from './UniversityTable';
import UniversityChartByDep from './UniversityChartByDep.jsx';



function Dashboard() {
  const sampleUniversities = [
    { id: 1, name: "Harvard University", rate: 95  },
    { id: 2, name: "MIT", rate: 90 },
    { id: 3, name: "Stanford University", rate: 99 },
  ];

  function calculateHierarchicalRankings(universities) {
    // Sort universities by their rate in descending order
    let sorted = [...universities].sort((a, b) => b.rate - a.rate);
    sorted=sorted.slice(0,3);

    // Assign rankings based on the sorted order
    return sorted.map((uni, index) => ({ ...uni, rank: index + 1 }));
  }

  return (
    <>  
      <NavBar />
      <Container className="mt-4">
            <h2>University Hierarchical Rankings</h2>
        <Row>
          <Col>
            <h3>Ranked Universities</h3>
            <UniversityTable universities={calculateHierarchicalRankings(sampleUniversities)} />
          </Col>
          <Col>
            <h3>Chart for University Ratings</h3>
            <UniversityChartByDep departmentName="Overall" universityData={sampleUniversities} />
          </Col>
        </Row>
        
      </Container>  
    </>
  );
}

export default Dashboard;
