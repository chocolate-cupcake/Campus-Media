import React, { useMemo, useState } from "react";
import { Card, Badge } from "react-bootstrap";
import universities from "./data.js";

export default function MatchingPrograms() {
  const [selectedType, setSelectedType] = useState("All");

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
                : program.type?.includes(selectedType)
            );
            return { ...dept, programs };
          })
          .filter((dept) => (dept.programs || []).length > 0);
        return { ...uni, departments };
      })
      .filter((uni) => (uni.departments || []).length > 0);
  }, [selectedType]);
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Matching Programs</Card.Title>
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
          <div className="program-list-scroll">
            {selectedValues.map((uni) => (
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
                            <Badge bg="success" className="program-rating">
                              {p.rating}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No programs found for the selected type.</p>
        )}
      </Card.Body>
    </Card>
  );
}
