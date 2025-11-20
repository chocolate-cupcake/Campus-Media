import React, { useEffect, useMemo, useState } from "react";
import universities from "./data.js";
import { Table } from "react-bootstrap";

// UniversityTable
// - Small ranking table that shows top universities by adjusted rating.
// - Reads review snapshots and listens for `cm:reviews-updated` events to
//   update displayed averages without requiring a full page reload.
function UniversityTable() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("campusMediaState");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
      }
    } catch {
      /* ignore parse errors */
    }
    const handler = (e) => {
      const next = Array.isArray(e?.detail) ? e.detail : null;
      if (next) setReviews(next);
      else {
        try {
          const raw = localStorage.getItem("campusMediaState");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
          }
        } catch {
          /* ignore parse errors */
        }
      }
    };
    window.addEventListener("cm:reviews-updated", handler);
    return () => window.removeEventListener("cm:reviews-updated", handler);
  }, []);

  const getDisplayUniRating = useMemo(() => {
    const byId = new Map();
    reviews
      .filter((r) => r.targetType === "uni")
      .forEach((r) => {
        const arr = byId.get(r.targetId) || [];
        arr.push(r);
        byId.set(r.targetId, arr);
      });
    return (uni) => {
      const revs = byId.get(uni.id) || [];
      if (!revs.length) return uni.rating;
      const sum = revs.reduce((s, r) => s + (r.score || 0), 0);
      return Number(((uni.rating + sum) / (1 + revs.length)).toFixed(2));
    };
  }, [reviews]);

  const ranked = useMemo(() => {
    const enriched = universities.map((u) => ({
      ...u,
      _disp: getDisplayUniRating(u),
    }));
    return enriched
      .sort((a, b) => (b._disp || 0) - (a._disp || 0))
      .slice(0, 3)
      .map((uni, index) => ({ ...uni, rank: index + 1 }));
  }, [getDisplayUniRating]);

  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead className="table-dark">
        <tr>
          <th>University</th>
          <th>Avg Rank</th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((uni) => (
          <tr key={uni.id}>
            <td>{uni.name}</td>
            <td>{uni.rank}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UniversityTable;
