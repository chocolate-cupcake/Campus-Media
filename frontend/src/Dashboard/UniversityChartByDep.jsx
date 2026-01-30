import React, { useEffect, useMemo, useState } from "react";
import { Card, Badge } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
import universities from "./data.js";
import { getReviews } from "../services/api.js";

function UniversityChartByDep() {
  const [selectedType, setSelectedType] = useState("All");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviews();
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();

    // Listen for review updates
    const handler = (e) => {
      const next = Array.isArray(e?.detail) ? e.detail : null;
      if (next) setReviews(next);
      else fetchReviews();
    };
    window.addEventListener("cm:reviews-updated", handler);
    return () => window.removeEventListener("cm:reviews-updated", handler);
  }, []);

  const availableTypes = useMemo(() => {
    const typesSet = new Set();
    (universities || []).forEach((uni) => {
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

  const selectedValues = useMemo(() => {
    return (universities || [])
      .map((uni) => {
        const departments = (uni.departments || [])
          .map((dept) => {
            const programs = (dept.programs || []).filter((program) =>
              selectedType === "All"
                ? true
                : program.type?.includes(selectedType),
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
  }, [selectedType]);

  const areaLabel = selectedType || "All";

  const labels = selectedValues.map((uni) => uni.name);

  const dataPoints = useMemo(() => {
    const byId = new Map();
    reviews
      .filter((r) => r.targetType === "uni")
      .forEach((r) => {
        const arr = byId.get(r.targetId) || [];
        arr.push(r);
        byId.set(r.targetId, arr);
      });
    return selectedValues.map((uni) => {
      const revs = byId.get(uni.id) || [];
      const adjustedUniRating = revs.length
        ? Number(
            (
              (uni.rating + revs.reduce((s, r) => s + (r.score || 0), 0)) /
              (1 + revs.length)
            ).toFixed(2),
          )
        : uni.rating || 0;
      const base =
        typeof uni.avgProgramRating === "number" && uni.avgProgramRating > 0
          ? Number(uni.avgProgramRating.toFixed(2))
          : adjustedUniRating;
      // If there are reviews, prefer adjustedUniRating to reflect user input even when programs exist
      return revs.length ? adjustedUniRating : base;
    });
  }, [selectedValues, reviews]);

  const data = {
    labels,
    datasets: [
      {
        label: `Average Program Ratings (${areaLabel})`,
        data: dataPoints,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <Card>
      <Card.Header>{`University Ratings by Area of Study: ${areaLabel}`}</Card.Header>
      <Card.Body>
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
        {selectedValues.length > 0 ? (
          <Bar data={data} />
        ) : (
          <p>No universities match the selected study areas.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default UniversityChartByDep;
