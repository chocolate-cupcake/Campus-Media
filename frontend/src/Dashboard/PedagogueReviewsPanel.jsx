import React from 'react';
import { Card, InputGroup, Form, Button } from 'react-bootstrap';
import PedagogueTable from './PedagogueTable.jsx';

export default function PedagogueReviewsPanel({
  studentUniversity,
  setStudentUniversity,
  studentCourses,
  setStudentCourses,
  findMatchesForStudent,
  universityOptions,
  searchProf,
  setSearchProf,
  professorsList,
  onReview,
  onDeleteReview,
  reviewedProfessors,
  userReviewedProfessors,
  canReview,
}) {
  return (
    <Card className="shadow-sm h-100 reviews-card">
      <Card.Body>
        <Card.Title>Pedagogue Reviews</Card.Title>
        <div className="reviews-controls mb-2">
          <InputGroup>
            <Form.Select value={studentUniversity} onChange={(e) => setStudentUniversity(e.target.value)} style={{minWidth:120}}>
              {universityOptions.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </Form.Select>
            <Form.Control
              placeholder="Courses taken (comma separated)"
              value={studentCourses}
              onChange={(e) => setStudentCourses(e.target.value)}
            />
            <Button variant="primary" onClick={findMatchesForStudent}>Find</Button>
          </InputGroup>
          <InputGroup className="mt-2">
            <Form.Control
              placeholder="Search pedagogues by name, course or research area"
              value={searchProf}
              onChange={(e) => setSearchProf(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="pedagogue-list-scroll">
          <PedagogueTable
            top={50}
            professors={professorsList}
            onReview={onReview}
            onDeleteReview={onDeleteReview}
            reviewedIds={reviewedProfessors}
            userReviewedIds={userReviewedProfessors}
            canReview={canReview}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
