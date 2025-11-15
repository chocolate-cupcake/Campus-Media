import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function UniversityReviewsPanel({ universities, getDisplayUniRating, reviewedUniversities, userReviewedUniversities, openReview, deleteMyReview, isStudent, currentUser, sameUniversity }) {
  return (
    <Card className="shadow-sm h-100 reviews-card">
      <Card.Body>
        <Card.Title>University Ratings & Reviews</Card.Title>
        <p className="text-muted small mb-2">See which universities have ratings and add a review.</p>
        <div className="list-group compact-list">
          {(universities || []).map((uni) => {
            const canReviewUni = isStudent && sameUniversity(currentUser.university, uni.name);
            const userHasReviewedUni = userReviewedUniversities.has(uni.id);
            return (
              <div key={uni.id} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                <div>
                  <strong className="small">{uni.name}</strong>
                  <div className="text-muted xsmall">Rating: {getDisplayUniRating(uni)}</div>
                </div>
                <div>
                  {userHasReviewedUni ? (
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-secondary" onClick={() => openReview('uni', uni.id, uni.name, getDisplayUniRating(uni))}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => deleteMyReview('uni', uni.id)}>Delete</Button>
                    </div>
                  ) : canReviewUni ? (
                    reviewedUniversities.has(uni.id) ? (
                      <Button size="sm" variant="outline-secondary" disabled>Viewed</Button>
                    ) : (
                      <Button size="sm" variant="outline-primary" onClick={() => openReview('uni', uni.id, uni.name, getDisplayUniRating(uni))}>Review</Button>
                    )
                  ) : (
                    <Button size="sm" variant="outline-secondary" disabled>View</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}
