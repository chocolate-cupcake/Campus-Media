import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ReviewModal({ show, onHide, reviewTarget, reviewScore, setReviewScore, reviewComment, setReviewComment, submitReview, reviews, reviewId, currentUser, deleteReviewById, canUserReviewTarget }) {
  if (!reviewTarget) return null;

  const existing = reviewId ? reviews.find(r => r.id === reviewId) : null;
  const canDelete = existing && String(existing.reviewerId) === String(currentUser?.id);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Leave a Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <strong>{reviewTarget.name}</strong>
          <div className="text-muted small">Current rating: {reviewTarget.currentRating}</div>
        </div>

        <Form.Group className="mb-2">
          <Form.Label>Score (1-5)</Form.Label>
          <Form.Select value={reviewScore} onChange={(e) => setReviewScore(e.target.value)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Comment (optional)</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Leave a short comment..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        {canDelete ? (
          <Button variant="danger" onClick={() => { deleteReviewById(reviewId); onHide(); }}>Delete</Button>
        ) : null}
  <Button variant="primary" onClick={submitReview} disabled={!canUserReviewTarget(reviewTarget)}>Submit Review</Button>
      </Modal.Footer>
    </Modal>
  );
}
