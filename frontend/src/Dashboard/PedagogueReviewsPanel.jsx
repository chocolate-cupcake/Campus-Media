import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, InputGroup, Form, Button } from "react-bootstrap";
import PedagogueTable from "./PedagogueTable.jsx";
import universities from "./data.js";
import ReviewModal from "./ReviewModal.jsx";

export default function PedagogueReviewsPanel() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchProf, setSearchProf] = useState("");
  const [studentUniversity, setStudentUniversity] = useState("Any");
  const [studentCourses, setStudentCourses] = useState("");
  const [matchedProfessors, setMatchedProfessors] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewedProfessors, setReviewedProfessors] = useState(new Set());
  const [userReviewedProfessors, setUserReviewedProfessors] = useState(
    new Set()
  );

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewId, setReviewId] = useState(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const profSet = new Set();
    const userSet = new Set();
    reviews.forEach((r) => {
      if (r.targetType === "prof") profSet.add(r.targetId);
      if (
        r.targetType === "prof" &&
        currentUser &&
        String(r.reviewerId) === String(currentUser.id)
      ) {
        userSet.add(r.targetId);
      }
    });
    setReviewedProfessors(profSet);
    setUserReviewedProfessors(userSet);
  }, [reviews, currentUser]);

  const allProfessors = useMemo(() => {
    const list = [];
    (universities || []).forEach((uni) => {
      (uni.departments || []).forEach((dept) => {
        (dept.professors || []).forEach((p) => {
          list.push({ ...p, university: uni.name, department: dept.name });
        });
      });
    });
    return list;
  }, []);

  const universityOptions = useMemo(
    () => ["Any", ...(universities || []).map((u) => u.name)],
    []
  );

  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const sameUniversity = useCallback((a, b) => {
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
  }, []);

  const filteredProfessors = useMemo(() => {
    const term = searchProf.trim().toLowerCase();
    if (!term) return allProfessors;
    return allProfessors.filter((p) => {
      const full = `${p.name} ${p.surname}`.toLowerCase();
      return (
        full.includes(term) ||
        (p.courses || []).some((c) => c.toLowerCase().includes(term)) ||
        (p.researchAreas || []).some((r) => r.toLowerCase().includes(term))
      );
    });
  }, [searchProf, allProfessors]);

  const getDisplayProfRating = useCallback(
    (prof) => {
      const revs = reviews.filter(
        (r) => r.targetType === "prof" && r.targetId === prof.id
      );
      if (!revs.length) return prof.rating;
      const sum = revs.reduce((s, r) => s + (r.score || 0), 0);
      const avg = (prof.rating + sum) / (1 + revs.length);
      return Number(avg.toFixed(2));
    },
    [reviews]
  );

  const findMatchesForStudent = () => {
    const terms = studentCourses
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (terms.length === 0) {
      setMatchedProfessors([]);
      return;
    }
    const matches = allProfessors.filter((p) => {
      if (studentUniversity !== "Any" && p.university !== studentUniversity)
        return false;
      const profCourses = (p.courses || []).map((c) => c.toLowerCase());
      return terms.some((t) => profCourses.some((pc) => pc.includes(t)));
    });
    setMatchedProfessors(matches);
  };

  const persistState = (newReviews) => {
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

  const isStudent =
    !!currentUser && (currentUser.role || "student") === "student";

  const openReview = (type, id, name, currentRating) => {
    const existing = reviews.find(
      (r) => r.targetType === type && r.targetId === id
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

  const submitReview = () => {
    if (!reviewTarget) return;
    if (!isStudent) return;
    if (reviewTarget.type === "prof") {
      const prof = allProfessors.find((p) => p.id === reviewTarget.id);
      if (!prof || !sameUniversity(prof.university, currentUser.university))
        return;
    }
    const { type, id } = reviewTarget;
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
      const reviewerToStore = isStudent ? String(currentUser.id) : null;
      newReviews.push({
        id: rid,
        targetType: type,
        targetId: id,
        score: Number(reviewScore),
        comment: reviewComment,
        reviewerId: reviewerToStore,
        date: new Date().toISOString(),
      });
    }
    setReviews(newReviews);
    persistState(newReviews);
    closeReview();
  };

  const deleteMyReview = (targetType, targetId) => {
    if (!currentUser) return;
    const idx = reviews.findIndex(
      (r) =>
        r.targetType === targetType &&
        r.targetId === targetId &&
        String(r.reviewerId) === String(currentUser.id)
    );
    if (idx === -1) return;
    const newReviews = [...reviews.slice(0, idx), ...reviews.slice(idx + 1)];
    setReviews(newReviews);
    persistState(newReviews);
  };
  const professorsList = useMemo(() => {
    const base = (
      studentCourses.trim() ? matchedProfessors : filteredProfessors
    )
      .filter((p) =>
        studentUniversity === "Any"
          ? true
          : sameUniversity(studentUniversity, p.university)
      )
      .map((p) => ({ ...p, rating: getDisplayProfRating(p) }));
    return base;
  }, [
    studentCourses,
    matchedProfessors,
    filteredProfessors,
    studentUniversity,
    getDisplayProfRating,
    sameUniversity,
  ]);

  return (
    <Card className="shadow-sm h-100 reviews-card">
      <Card.Body>
        <Card.Title>Pedagogue Reviews</Card.Title>
        <div className="reviews-controls mb-2">
          <InputGroup>
            <Form.Select
              value={studentUniversity}
              onChange={(e) => setStudentUniversity(e.target.value)}
              style={{ minWidth: 120 }}
            >
              {universityOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              placeholder="Courses taken (comma separated)"
              value={studentCourses}
              onChange={(e) => setStudentCourses(e.target.value)}
            />
            <Button variant="primary" onClick={findMatchesForStudent}>
              Find
            </Button>
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
            onReview={(p) =>
              openReview(
                "prof",
                p.id,
                `${p.name} ${p.surname}`,
                getDisplayProfRating(p)
              )
            }
            onDeleteReview={(p) => deleteMyReview("prof", p.id)}
            reviewedIds={reviewedProfessors}
            userReviewedIds={userReviewedProfessors}
            canReview={(p) =>
              isStudent && sameUniversity(currentUser.university, p.university)
            }
          />
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
        deleteReviewById={(rid) => {
          const newReviews = reviews.filter((r) => r.id !== rid);
          setReviews(newReviews);
          persistState(newReviews);
        }}
        canUserReviewTarget={(tgt) => {
          if (!isStudent || !tgt || !currentUser) return false;
          if (tgt.type === "prof") {
            const prof = allProfessors.find((p) => p.id === tgt.id);
            return (
              !!prof && sameUniversity(prof.university, currentUser.university)
            );
          }
          return false;
        }}
      />
    </Card>
  );
}
