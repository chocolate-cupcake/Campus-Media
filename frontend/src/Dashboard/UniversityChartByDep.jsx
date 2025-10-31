import React from "react";
import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function UniversityChartByDep({ departmentName, universityData }) {
  // Prepare data for the bar chart
  const data = {
    labels: universityData.map((uni) => uni.name),
    datasets: [
      {
        label: `Average Ratings in ${departmentName}`,
        data: universityData.map((uni) => uni.rating),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  return (
    <Card>
      <Card.Header>{`University Ratings by Department: ${departmentName}`}</Card.Header>
      <Card.Body>
        <Bar data={data} />
      </Card.Body>
    </Card>
  );
}

export default UniversityChartByDep;
