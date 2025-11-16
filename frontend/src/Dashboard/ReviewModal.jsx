import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ReviewModal({
  show,
  onHide,
  reviewTarget,
  reviewScore,
  setReviewScore,
  reviewComment,
  setReviewComment,
  submitReview,
  reviews = [],
  reviewId,
  currentUser,
  deleteReviewById,
  canUserReviewTarget = () => true,
  onSubmit, // optional alt submit handler: (payload) => void
}) {
  // internal fallbacks (hooks must be called unconditionally)
  const [iShow, setIShow] = useState(Boolean(show));
  const [iScore, setIScore] = useState(reviewScore ?? 5);
  const [iComment, setIComment] = useState(reviewComment ?? "");

  // keep internal in sync when props change
  useEffect(() => {
    if (typeof show === "boolean") setIShow(show);
  }, [show]);
  useEffect(() => {
    if (typeof reviewScore !== "undefined") setIScore(reviewScore);
  }, [reviewScore]);
  useEffect(() => {
    if (typeof reviewComment !== "undefined") setIComment(reviewComment);
  }, [reviewComment]);

  const existing = reviewId ? reviews.find((r) => r.id === reviewId) : null;
  const canDelete =
    existing && String(existing.reviewerId) === String(currentUser?.id);

  // Only show when explicitly requested or when internal flag is set AND a target exists
  const effectiveShow =
    (typeof show === "boolean" ? show : iShow) && !!reviewTarget;
  const handleHide = () => {
    if (typeof onHide === "function") onHide();
    else setIShow(false);
  };

  const effectiveScore =
    typeof reviewScore !== "undefined" ? reviewScore : iScore;
  const handleScore = (val) => {
    if (typeof setReviewScore === "function") setReviewScore(val);
    else setIScore(val);
  };
  const effectiveComment =
    typeof reviewComment !== "undefined" ? reviewComment : iComment;
  const handleComment = (val) => {
    if (typeof setReviewComment === "function") setReviewComment(val);
    else setIComment(val);
  };

  const handleSubmit = () => {
    if (!reviewTarget) return;
    if (typeof submitReview === "function") {
      submitReview();
    } else if (typeof onSubmit === "function") {
      onSubmit({
        reviewTarget,
        score: Number(effectiveScore),
        comment: effectiveComment,
      });
    }
    handleHide();
  };

  const handleDelete = () => {
    if (typeof deleteReviewById === "function" && reviewId) {
      deleteReviewById(reviewId);
    }
    handleHide();
  };

  return (
    <Modal show={effectiveShow} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Leave a Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <strong>{reviewTarget?.name ?? ""}</strong>
          {reviewTarget ? (
            <div className="text-muted small">
              Current rating: {reviewTarget.currentRating}
            </div>
          ) : null}
        </div>

        <Form.Group className="mb-2">
          <Form.Label>Score (1-5)</Form.Label>
          <Form.Select
            value={effectiveScore}
            onChange={(e) => handleScore(e.target.value)}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Comment (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Leave a short comment..."
            value={effectiveComment}
            onChange={(e) => handleComment(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>
          Cancel
        </Button>
        {canDelete ? (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        ) : null}
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!reviewTarget || !canUserReviewTarget(reviewTarget)}
        >
          Submit Review
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
