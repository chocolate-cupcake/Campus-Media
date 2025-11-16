import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Button } from "react-bootstrap";
import universities from "./data.js";
import ReviewModal from "./ReviewModal.jsx";

/**
 * PedagogueTable
 * Self-contained version. If external handlers/props are not provided,
 * it will manage reviews and actions internally using localStorage.
 */
function PedagogueTable({
  top,
  professors,
  onReview,
  onDeleteReview,
  reviewedIds,
  userReviewedIds,
  canReview,
}) {
  // Internal state only used when corresponding props are not provided
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [internalReviewedIds, setInternalReviewedIds] = useState(new Set());
  const [internalUserReviewedIds, setInternalUserReviewedIds] = useState(
    new Set()
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewId, setReviewId] = useState(null);

  const useInternal = !onReview && !onDeleteReview;
  const topCount = typeof top === "number" ? top : 5;

  useEffect(() => {
    if (!useInternal) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
    try {
      const raw = localStorage.getItem("campusMediaState");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
      }
    } catch (e) {
      console.error(e);
    }
  }, [useInternal]);

  useEffect(() => {
    if (!useInternal) return;
    const allSet = new Set();
    const mineSet = new Set();
    reviews.forEach((r) => {
      if (r.targetType === "prof") allSet.add(r.targetId);
      if (
        r.targetType === "prof" &&
        currentUser &&
        String(r.reviewerId) === String(currentUser.id)
      ) {
        mineSet.add(r.targetId);
      }
    });
    setInternalReviewedIds(allSet);
    setInternalUserReviewedIds(mineSet);
  }, [reviews, currentUser, useInternal]);

  const allProfessors = useMemo(() => {
    if (Array.isArray(professors)) return professors;
    const list = [];
    (universities || []).forEach((uni) => {
      (uni.departments || []).forEach((dept) => {
        (dept.professors || []).forEach((p) => {
          list.push({ ...p, university: uni.name, department: dept.name });
        });
      });
    });
    return list;
  }, [professors]);

  const getDisplayProfRating = useCallback(
    (prof) => {
      if (!useInternal) return prof.rating;
      const revs = reviews.filter(
        (r) => r.targetType === "prof" && r.targetId === prof.id
      );
      if (!revs.length) return prof.rating;
      const sum = revs.reduce((s, r) => s + (r.score || 0), 0);
      const avg = (prof.rating + sum) / (1 + revs.length);
      return Number(avg.toFixed(2));
    },
    [reviews, useInternal]
  );

  const sorted = useMemo(() => {
    return [...allProfessors]
      .map((p) => ({ ...p, rating: getDisplayProfRating(p) }))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, topCount);
  }, [allProfessors, topCount, getDisplayProfRating]);

  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const sameUniversity = (a, b) => {
    if (!a || !b) return false;
    const na = normalize(a);
    const nb = normalize(b);
    if (na === nb) return true;
    const findCanonicalId = (nameNorm) => {
      if (!universities || !Array.isArray(universities)) return null;
      for (const uni of universities) {
        const candidates = [uni.name, ...(uni.aliases || [])];
        for (const c of candidates) {
          if (normalize(c) === nameNorm) return uni.id;
        }
      }
      return null;
    };
    const caId = findCanonicalId(na);
    const cbId = findCanonicalId(nb);
    if (caId && cbId) return caId === cbId;
    return na.includes(nb) || nb.includes(na);
  };

  const internalCanReview = (p) => {
    if (!currentUser) return false;
    const role = currentUser.role || "student";
    if (role !== "student") return false;
    return sameUniversity(currentUser.university, p.university);
  };

  const persist = (newReviews) => {
    try {
      const state = JSON.parse(
        localStorage.getItem("campusMediaState") || "{}"
      );
      state.reviews = newReviews;
      localStorage.setItem("campusMediaState", JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  };

  const openInternal = (p) => {
    const existing = reviews.find(
      (r) => r.targetType === "prof" && r.targetId === p.id
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
    setReviewTarget({
      type: "prof",
      id: p.id,
      name: `${p.name} ${p.surname}`,
      currentRating: getDisplayProfRating(p),
    });
    setModalOpen(true);
  };

  const submitInternal = () => {
    if (!reviewTarget || !currentUser) return;
    const newReviews = [...reviews];
    if (reviewId) {
      const idx = newReviews.findIndex((r) => r.id === reviewId);
      if (idx !== -1) {
        const existing = newReviews[idx];
        if (String(existing.reviewerId) !== String(currentUser.id)) return;
        newReviews[idx] = {
          ...existing,
          score: Number(reviewScore),
          comment: reviewComment,
          reviewerId: existing.reviewerId || null,
          date: new Date().toISOString(),
        };
      }
    } else {
      const rid = Date.now().toString();
      newReviews.push({
        id: rid,
        targetType: "prof",
        targetId: reviewTarget.id,
        score: Number(reviewScore),
        comment: reviewComment,
        reviewerId: String(currentUser.id),
        date: new Date().toISOString(),
      });
    }
    setReviews(newReviews);
    persist(newReviews);
    setModalOpen(false);
    setReviewTarget(null);
    setReviewScore(5);
    setReviewComment("");
    setReviewId(null);
  };

  const deleteInternal = (p) => {
    if (!currentUser) return;
    const idx = reviews.findIndex(
      (r) =>
        r.targetType === "prof" &&
        r.targetId === p.id &&
        String(r.reviewerId) === String(currentUser.id)
    );
    if (idx === -1) return;
    const newReviews = [...reviews.slice(0, idx), ...reviews.slice(idx + 1)];
    setReviews(newReviews);
    persist(newReviews);
  };

  const effectiveReviewed = reviewedIds ?? internalReviewedIds;
  const effectiveUserReviewed = userReviewedIds ?? internalUserReviewedIds;

  const renderActions = (p) => {
    const userHas =
      effectiveUserReviewed &&
      typeof effectiveUserReviewed.has === "function" &&
      effectiveUserReviewed.has(p.id);
    const someoneHas =
      effectiveReviewed &&
      typeof effectiveReviewed.has === "function" &&
      effectiveReviewed.has(p.id);

    const can = canReview ? canReview(p) : internalCanReview(p);

    if (userHas) {
      return (
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => (onReview ? onReview(p) : openInternal(p))}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() =>
              onDeleteReview ? onDeleteReview(p) : deleteInternal(p)
            }
          >
            Delete
          </Button>
        </div>
      );
    }
    if (someoneHas) {
      return (
        <Button size="sm" variant="outline-secondary" disabled>
          Viewed
        </Button>
      );
    }
    if (can) {
      return (
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => (onReview ? onReview(p) : openInternal(p))}
        >
          Review
        </Button>
      );
    }
    return (
      <Button size="sm" variant="outline-secondary" disabled>
        View
      </Button>
    );
  };

  return (
    <>
      <Table
        striped
        hover
        responsive
        className="mt-2 table-sm align-middle compact-table"
      >
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>University</th>
            <th>Department</th>
            <th>Courses</th>
            <th>Rating</th>
            <th>Years</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, index) => (
            <tr key={p.id || `${p.name}-${index}`}>
              <td>{index + 1}</td>
              <td>
                {p.name} {p.surname}
              </td>
              <td>{p.university}</td>
              <td>{p.department}</td>
              <td>{(p.courses || []).slice(0, 3).join(", ")}</td>
              <td>{p.rating ?? "—"}</td>
              <td>{p.yearsOfExperience ?? "—"}</td>
              <td>{renderActions(p)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {useInternal && reviewTarget ? (
        <ReviewModal
          show={modalOpen}
          onHide={() => setModalOpen(false)}
          reviewTarget={reviewTarget}
          reviewScore={reviewScore}
          setReviewScore={setReviewScore}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          submitReview={submitInternal}
          reviews={reviews}
          reviewId={reviewId}
          currentUser={currentUser}
          deleteReviewById={(rid) => {
            const newReviews = reviews.filter((r) => r.id !== rid);
            setReviews(newReviews);
            try {
              const state = JSON.parse(
                localStorage.getItem("campusMediaState") || "{}"
              );
              state.reviews = newReviews;
              localStorage.setItem("campusMediaState", JSON.stringify(state));
            } catch (e) {
              console.error(e);
            }
          }}
          canUserReviewTarget={() => {
            const prof = allProfessors.find((p) => p.id === reviewTarget?.id);
            if (!prof) return false;
            return internalCanReview(prof);
          }}
        />
      ) : null}
    </>
  );
}

export default PedagogueTable;
