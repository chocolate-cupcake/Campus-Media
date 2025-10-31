import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from "../mainPage/navBar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import UniversityTable from './UniversityTable';
import UniversityChartByDep from './UniversityChartByDep.jsx';
import universities from './data.js';



function Dashboard() {
  

  function calculateHierarchicalRankings(universities) {
    // Sort universities by their rating in descending order
    let sorted = [...universities].sort((a, b) => b.rating - a.rating);
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
            <UniversityTable universities={calculateHierarchicalRankings(universities)} />
          </Col>
          <Col>
            <h3>Chart for University Ratings</h3>
            <UniversityChartByDep departmentName="Overall" universityData={universities} />
          </Col>
        </Row>
        
      </Container>  
    </>
  );
}

export default Dashboard;
