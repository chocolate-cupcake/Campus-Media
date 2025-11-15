import React from 'react';
import { Card, Badge } from 'react-bootstrap';

export default function MatchingPrograms({ selectedValues }) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Matching Programs</Card.Title>
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
                              <div className="text-muted small">{p.degree} • {p.language} • {p.credits} cr</div>
                            </div>
                            <Badge bg="success" className="program-rating">{p.rating}</Badge>
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
