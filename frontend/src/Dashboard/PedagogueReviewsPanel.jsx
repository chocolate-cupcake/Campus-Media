import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, InputGroup, Form, Button } from "react-bootstrap";
import PedagogueTable from "./PedagogueTable.jsx";
import universities from "./data.js";
import ReviewModal from "./ReviewModal.jsx";
import {
  getCurrentUser,
  getReviews,
  createReview,
  updateReview,
  deleteReview as apiDeleteReview,
} from "../services/api.js";

// PedagogueReviewsPanel
// - Lists pedagogues across universities and provides searching, filtering
//   and matching functionality for students.
// - Manages review state (load/save) and opens `ReviewModal` for create/edit.
export default function PedagogueReviewsPanel() {
  // Component state
  // - `currentUser`: currently signed-in user (from localStorage)
  // - `searchProf`, `studentUniversity`, `studentCourses`: UI filters
  // - `matchedProfessors`: results from course-based matching
  // - `reviews`: persisted reviews loaded from `campusMediaState`
  // - `reviewedProfessors`, `userReviewedProfessors`: sets derived from `reviews`
  const [currentUser, setCurrentUser] = useState(null);
  const [searchProf, setSearchProf] = useState("");
  const [studentUniversity, setStudentUniversity] = useState("Any");
  const [studentCourses, setStudentCourses] = useState("");
  const [matchedProfessors, setMatchedProfessors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewedProfessors, setReviewedProfessors] = useState(new Set());
  const [userReviewedProfessors, setUserReviewedProfessors] = useState(
    new Set(),
  );

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewId, setReviewId] = useState(null);

  // On mount: load current user and persisted reviews from localStorage
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
    };
    fetchData();
  }, []);

  // Maintain sets for quick lookup: which pedagogues have any reviews and
  // which ones were reviewed by the current user
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
    // Flatten professors across all universities into a single list used by
    // the panel and the table component. Each professor carries their
    // university and department for filtering and display.
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
    [],
  );
  const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

  // Compare university names using normalized strings only .
  const sameUniversity = useCallback((a, b) => {
    if (!a || !b) return false;
    const na = normalize(a);
    const nb = normalize(b);
    return na === nb  }, []);

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
      // Compute an adjusted rating by combining base `prof.rating` with any
      // persisted reviews for that professor. This keeps base data while
      // reflecting user feedback.
      const revs = reviews.filter(
        (r) => r.targetType === "prof" && r.targetId === prof.id,
      );
      if (!revs.length) return prof.rating;
      const sum = revs.reduce((s, r) => s + (r.score || 0), 0);
      const avg = (prof.rating + sum) / (1 + revs.length);
      return Number(avg.toFixed(2));
    },
    [reviews],
  );

  const findMatchesForStudent = () => {
    // Find professors that match the comma-separated course terms provided by
    // the student. This is a simple fuzzy match against the professor's
    // `courses` list and can be used to find relevant pedagogues.
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

<<<<<<< HEAD
  const notifyReviewsUpdated = (newReviews) => {
=======
  const persistState = (newReviews) => {
    
>>>>>>> 95bf94852402ac5abb779aec3ac1be3dbd1c61c5
    try {
      window.dispatchEvent(
        new CustomEvent("cm:reviews-updated", { detail: newReviews }),
      );
    } catch {}
  };

  const isStudent =
    !!currentUser && (currentUser.role || "student") === "student";

  const openReview = (type, id, name, currentRating) => {
    // Prepare the modal for editing or creating a review for the selected
    // target. If an existing review is found we pre-fill the fields.
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
    // Reset modal state
    setReviewModalOpen(false);
    setReviewTarget(null);
    setReviewScore(5);
    setReviewComment("");
    setReviewId(null);
  };

<<<<<<< HEAD
  const submitReview = async () => {
=======
  const submitReview = () => {
    // Validate and submit the review. Only students are allowed to submit
    // reviews and students may only review pedagogues from their university.
>>>>>>> 95bf94852402ac5abb779aec3ac1be3dbd1c61c5
    if (!reviewTarget) return;
    if (!isStudent) return;
    if (reviewTarget.type === "prof") {
      const prof = allProfessors.find((p) => p.id === reviewTarget.id);
      if (!prof || !sameUniversity(prof.university, currentUser.university))
        return;
    }
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

<<<<<<< HEAD
  const deleteMyReview = async (targetType, targetId) => {
=======
  const deleteMyReview = (targetType, targetId) => {
    // Allow current user to delete their own review for the specified target
>>>>>>> 95bf94852402ac5abb779aec3ac1be3dbd1c61c5
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
  const professorsList = useMemo(() => {
    // Build the final list shown to the table: either matchedProfessors (if
    // the student provided courses) or the filteredProfessors from the
    // search box. Additionally filter by selected university and attach
    // the adjusted rating.
    const base = (
      studentCourses.trim() ? matchedProfessors : filteredProfessors
    )
      .filter((p) =>
        studentUniversity === "Any"
          ? true
          : sameUniversity(studentUniversity, p.university),
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
                getDisplayProfRating(p),
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
