import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import universitiesDefault from "./data.js";
import ReviewModal from "./ReviewModal.jsx";
import {
  getCurrentUser,
  getReviews,
  createReview,
  updateReview,
  deleteReview as apiDeleteReview,
} from "../services/api.js";

// UniversityReviewsPanel
// - Displays a list of universities with buttons to view/add/edit reviews.
// - Loads persisted `campusMediaState.data` and merges defaults so newly
//   added universities remain visible even when older persisted snapshots exist.
// - Delegates review editing to `ReviewModal` and centralizes persistence.
export default function UniversityReviewsPanel() {
  const [data, setData] = useState(universitiesDefault);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewedUniversities, setReviewedUniversities] = useState(new Set());
  const [userReviewedUniversities, setUserReviewedUniversities] = useState(
    new Set(),
  );

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewId, setReviewId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try session storage first
        const cached = sessionStorage.getItem("currentUser");
        if (cached) {
          setCurrentUser(JSON.parse(cached));
        }

        const [user, reviewsData] = await Promise.all([
          getCurrentUser(),
          getReviews(),
        ]);

        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
<<<<<<< HEAD
    };
    fetchData();
=======
    } catch {
      /* ignore parse errors */
    }
>>>>>>> 95bf94852402ac5abb779aec3ac1be3dbd1c61c5
  }, []);

  useEffect(() => {
    const uniSet = new Set();
    const userSet = new Set();
    reviews.forEach((r) => {
      if (r.targetType === "uni") uniSet.add(r.targetId);
      if (
        r.targetType === "uni" &&
        currentUser &&
        String(r.reviewerId) === String(currentUser.id)
      ) {
        userSet.add(r.targetId);
      }
    });
    setReviewedUniversities(uniSet);
    setUserReviewedUniversities(userSet);
  }, [reviews, currentUser]);

  const isStudent =
    !!currentUser && (currentUser.role || "student") === "student";

  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  // Simple normalized string comparison for university matching.
  // Aliases are intentionally ignored here per request.
  const sameUniversity = (a, b) => {
    if (!a || !b) return false;
    const na = normalize(a);
    const nb = normalize(b);
    return na === nb || na.includes(nb) || nb.includes(na);
  };

  const getDisplayUniRating = (uni) => {
    const revs = reviews.filter(
      (r) => r.targetType === "uni" && r.targetId === uni.id,
    );
    if (!revs.length) return uni.rating;
    const sum = revs.reduce((s, r) => s + (r.score || 0), 0);
    const avg = (uni.rating + sum) / (1 + revs.length);
    return Number(avg.toFixed(2));
  };

  const notifyReviewsUpdated = (newReviews) => {
    try {
      window.dispatchEvent(
        new CustomEvent("cm:reviews-updated", { detail: newReviews }),
      );
<<<<<<< HEAD
    } catch {}
=======
      state.data = data;
      state.reviews = newReviews;
      localStorage.setItem("campusMediaState", JSON.stringify(state));
      try {
        window.dispatchEvent(
          new CustomEvent("cm:reviews-updated", { detail: newReviews })
        );
      } catch {
        /* ignore event dispatch errors */
      }
    } catch (e) {
      console.error(e);
    }
>>>>>>> 95bf94852402ac5abb779aec3ac1be3dbd1c61c5
  };

  const openReview = (type, id, name, currentRating) => {
    const existing = reviews.find(
      (r) => r.targetType === type && r.targetId === id,
    );
    if (existing) {
      setReviewId(existing.id);
      setReviewScore(existing.score);
      setReviewComment(existing.comment || "");
    } else {
      setReviewId(null);
      setReviewScore(5);
      setReviewComment("");
    }
    setReviewTarget({ type, id, name, currentRating });
    setReviewModalOpen(true);
  };

  const closeReview = () => {
    setReviewModalOpen(false);
    setReviewTarget(null);
    setReviewScore(5);
    setReviewComment("");
    setReviewId(null);
  };

  const submitReview = async () => {
    if (!reviewTarget) return;
    if (!isStudent) return;
    if (
      reviewTarget.type === "uni" &&
      !sameUniversity(currentUser.university, reviewTarget.name)
    )
      return;

    const { type, id } = reviewTarget;

    try {
      if (reviewId) {
        // Update existing review
        await updateReview(reviewId, {
          score: Number(reviewScore),
          comment: reviewComment,
        });

        const newReviews = reviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                score: Number(reviewScore),
                comment: reviewComment,
                date: new Date().toISOString(),
              }
            : r,
        );
        setReviews(newReviews);
        notifyReviewsUpdated(newReviews);
      } else {
        // Create new review
        const reviewData = {
          targetType: type,
          targetId: id,
          score: Number(reviewScore),
          comment: reviewComment,
        };

        const newReview = await createReview(reviewData);
        const newReviews = [...reviews, newReview];
        setReviews(newReviews);
        notifyReviewsUpdated(newReviews);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }

    closeReview();
  };

  const deleteMyReview = async (targetType, targetId) => {
    if (!currentUser) return;
    const review = reviews.find(
      (r) =>
        r.targetType === targetType &&
        r.targetId === targetId &&
        String(r.reviewerId) === String(currentUser.id),
    );
    if (!review) return;

    try {
      await apiDeleteReview(review.id);
      const newReviews = reviews.filter((r) => r.id !== review.id);
      setReviews(newReviews);
      notifyReviewsUpdated(newReviews);
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  return (
    <Card className="shadow-sm h-100 reviews-card">
      <Card.Body>
        <Card.Title>University Ratings & Reviews</Card.Title>
        <p className="text-muted small mb-2">
          See which universities have ratings and add a review.
        </p>
        <div className="list-group compact-list">
          {(data || []).map((uni) => {
            const canReviewUni =
              isStudent &&
              currentUser &&
              sameUniversity(currentUser.university, uni.name);
            const userHasReviewedUni = userReviewedUniversities.has(uni.id);
            return (
              <div
                key={uni.id}
                className="d-flex justify-content-between align-items-center py-1 border-bottom"
              >
                <div>
                  <strong className="small">{uni.name}</strong>
                  <div className="text-muted xsmall">
                    Rating: {getDisplayUniRating(uni)}
                  </div>
                </div>
                <div>
                  {userHasReviewedUni ? (
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() =>
                          openReview(
                            "uni",
                            uni.id,
                            uni.name,
                            getDisplayUniRating(uni),
                          )
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => deleteMyReview("uni", uni.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : canReviewUni ? (
                    reviewedUniversities.has(uni.id) ? (
                      <Button size="sm" variant="outline-secondary" disabled>
                        Viewed
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() =>
                          openReview(
                            "uni",
                            uni.id,
                            uni.name,
                            getDisplayUniRating(uni),
                          )
                        }
                      >
                        Review
                      </Button>
                    )
                  ) : (
                    <Button size="sm" variant="outline-secondary" disabled>
                      View
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card.Body>
      <ReviewModal
        show={reviewModalOpen}
        onHide={closeReview}
        reviewTarget={reviewTarget}
        reviewScore={reviewScore}
        setReviewScore={setReviewScore}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        submitReview={submitReview}
        reviews={reviews}
        reviewId={reviewId}
        currentUser={currentUser}
        deleteReviewById={async (rid) => {
          try {
            await apiDeleteReview(rid);
            const newReviews = reviews.filter((r) => r.id !== rid);
            setReviews(newReviews);
            notifyReviewsUpdated(newReviews);
          } catch (error) {
            console.error("Failed to delete review:", error);
          }
        }}
        canUserReviewTarget={(tgt) => {
          if (!isStudent || !tgt || !currentUser) return false;
          if (tgt.type === "uni")
            return sameUniversity(currentUser.university, tgt.name);
          return false;
        }}
      />
    </Card>
  );
}
