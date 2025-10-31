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

function UniversityChartByDep({ areaOfStudy, universityData = [] }) {
  const areaLabel = areaOfStudy || "All";

  // Labels are university names
  const labels = universityData.map((uni) => uni.name);

  // Use the computed avgProgramRating if available, otherwise fall back to uni.rating
  const dataPoints = universityData.map((uni) =>
    typeof uni.avgProgramRating === "number" && uni.avgProgramRating > 0
      ? Number(uni.avgProgramRating.toFixed(2))
      : uni.rating || 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: `Average Program Ratings (${areaLabel})`,
        data: dataPoints,
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  return (
    <Card>
      <Card.Header>{`University Ratings by Area of Study: ${areaLabel}`}</Card.Header>
      <Card.Body>
        {universityData.length > 0 ? (
          <Bar data={data} />
        ) : (
          <p>No universities match the selected study areas.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default UniversityChartByDep;
