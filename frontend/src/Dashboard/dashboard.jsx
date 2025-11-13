import { useState, useMemo, useEffect } from "react";
import {Container, Row, Col,Card,Form,Badge,InputGroup,Button,Modal,} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import NavBar from "../mainPage/navBar.jsx";
import { getStudents } from "../mainPage/studentData.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import UniversityTable from "./UniversityTable";
import UniversityChartByDep from "./UniversityChartByDep.jsx";
import PedagogueTable from "./PedagogueTable.jsx";
import universities from "./data.js";

function Dashboard() {

  function calculateHierarchicalRankings(universities) {
    // Sort universities by their rating in descending order
    let sorted = [...universities].sort((a, b) => b.rating - a.rating);
    sorted = sorted.slice(0, 3);
    // Assign rankings based on the sorted order
    return sorted.map((uni, index) => ({ ...uni, rank: index + 1 }));
  }

  


  // data state: loadable/persisted full dataset (universities, departments, professors, programs)
  const [data, setData] = useState(universities);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  // students who can leave reviews (sourced from centralized studentData)
  const [students, setStudents] = useState(() => getStudents());
  const [selectedType, setSelectedType] = useState("All");
  const [searchProf, setSearchProf] = useState("");
  const [reviewedUniversities, setReviewedUniversities] = useState(new Set());
  const [reviewedProfessors, setReviewedProfessors] = useState(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // {type:'uni'|'prof', id, name, currentRating}
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewId, setReviewId] = useState(null);
  // persisted reviews: array of { id, targetType: 'uni'|'prof', targetId, score, comment, date }
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Check localStorage first (for logged-in users)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    } else if (location.state?.user) {
      // Check router state for guest user
      setCurrentUser(location.state.user);
    }
  }, [location.state]);

  // Memoized values
  const allProfessors = useMemo(() => {
    const list = [];
    (data || []).forEach((uni) => {
      (uni.departments || []).forEach((dept) => {
        (dept.professors || []).forEach((p) => {
          list.push({ ...p, university: uni.name, department: dept.name });
        });
      });
    });
    return list;
  }, [data]);

  // sets of targets the current user has authored reviews for
  const userReviewedProfessors = useMemo(() => new Set(reviews.filter(r => r.targetType === 'prof' && String(r.reviewerId) === String(currentUser?.id)).map(r => r.targetId)), [reviews, currentUser]);
  const userReviewedUniversities = useMemo(() => new Set(reviews.filter(r => r.targetType === 'uni' && String(r.reviewerId) === String(currentUser?.id)).map(r => r.targetId)), [reviews, currentUser]);

  // student matching state
  const [studentUniversity, setStudentUniversity] = useState('Any');
  const [studentCourses, setStudentCourses] = useState('');
  const [matchedProfessors, setMatchedProfessors] = useState([]);

  const universityOptions = useMemo(() => ['Any', ...((data || []).map(u => u.name))], [data]);

  const findMatchesForStudent = () => {
    const terms = studentCourses
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    if (terms.length === 0) {
      setMatchedProfessors([]);
      return;
    }

    const matches = allProfessors.filter(p => {
      if (studentUniversity !== 'Any' && p.university !== studentUniversity) return false;
      const profCourses = (p.courses || []).map(c => c.toLowerCase());
      // match if any student term appears inside any prof course
      return terms.some(t => profCourses.some(pc => pc.includes(t)));
    });

    setMatchedProfessors(matches);
  };

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

  

  // students list is loaded/persisted but reviewer selection UI has been removed

  const openReview = (type, id, name, currentRating) => {
    // check for existing review
    const existing = reviews.find(r => r.targetType === (type === 'uni' ? 'uni' : 'prof') && r.targetId === id);
    if (existing) {
      setReviewId(existing.id);
      setReviewScore(existing.score);
      setReviewComment(existing.comment || "");
      // reviewer selection removed; modal will show info but editing only allowed for original author
    } else {
      setReviewId(null);
      setReviewScore(5);
      setReviewComment("");
      // default reviewer will be current user on submit (if student)
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
    // only students are allowed to submit reviews
    if (!isStudent) return;
    // ensure the student can only review their own university/pedagogue
    if (reviewTarget.type === 'uni' && !sameUniversity(currentUser.university, reviewTarget.name)) return;
    if (reviewTarget.type === 'prof') {
      const prof = allProfessors.find(p => p.id === reviewTarget.id);
      if (!prof || !sameUniversity(prof.university, currentUser.university)) return;
    }
    const { type, id } = reviewTarget;

    const newReviews = [...reviews];
    if (reviewId) {
      // update - only allow if current user is the original reviewer
      const idx = newReviews.findIndex(r => r.id === reviewId);
      if (idx !== -1) {
        const existing = newReviews[idx];
        if (String(existing.reviewerId) !== String(currentUser.id)) return; // not allowed to edit
        newReviews[idx] = { ...existing, score: Number(reviewScore), comment: reviewComment, reviewerId: existing.reviewerId || null, date: new Date().toISOString() };
      }
    } else {
      // add
      const rid = Date.now().toString();
      // reviewer is always the current logged-in student (no selector)
      const reviewerToStore = isStudent ? String(currentUser.id) : null;
      newReviews.push({ id: rid, targetType: type === 'uni' ? 'uni' : 'prof', targetId: id, score: Number(reviewScore), comment: reviewComment, reviewerId: reviewerToStore, date: new Date().toISOString() });
    }

    setReviews(newReviews);
    // update reviewed sets
    if (type === 'uni') setReviewedUniversities(s => new Set(s).add(id));
    else setReviewedProfessors(s => new Set(s).add(id));

    // persist
    try {
      const state = JSON.parse(localStorage.getItem('campusMediaState') || '{}');
      // ensure we save the full dataset as well
      state.data = data;
      state.reviews = newReviews;
      state.students = students;
      localStorage.setItem('campusMediaState', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist reviews', e);
    }

    closeReview();
  };

  const getDisplayUniRating = (uni) => {
    const revs = reviews.filter(r => r.targetType === 'uni' && r.targetId === uni.id);
    if (!revs.length) return uni.rating;
    const sum = revs.reduce((s, r) => s + (r.score || 0), 0);
    const avg = (uni.rating + sum) / (1 + revs.length);
    return Number(avg.toFixed(2));
  };

  const getDisplayProfRating = (prof) => {
    const revs = reviews.filter(r => r.targetType === 'prof' && r.targetId === prof.id);
    if (!revs.length) return prof.rating;
    const sum = revs.reduce((s, r) => s + (r.score || 0), 0);
    const avg = (prof.rating + sum) / (1 + revs.length);
    return Number(avg.toFixed(2));
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // load persisted state (reviews) from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('campusMediaState');
      if (raw) {
        const parsed = JSON.parse(raw);
        // If there's saved data, load it. However, persisted state may be older
        // and miss universities recently added to the local `data.js` file
        // (for example POLIS, UBT, UTS, UET, Albanian University). Merge any
        // missing entries from the default import so they appear in the UI.
        if (parsed.data) {
          try {
            const parsedData = Array.isArray(parsed.data) ? parsed.data.slice() : [];
            const existingIds = new Set(parsedData.map(u => u && u.id).filter(Boolean));
            // `universities` is the default dataset imported at module top
            (universities || []).forEach((defUni) => {
              if (!existingIds.has(defUni.id)) parsedData.push(defUni);
            });
            setData(parsedData);
          } catch (e) {
            // fallback to parsed data if merge fails
            console.error('Failed to merge persisted data with local defaults', e);
            setData(parsed.data);
          }
        }
        if (Array.isArray(parsed.reviews)) {
          setReviews(parsed.reviews);
          // set reviewed sets
          const uniSet = new Set();
          const profSet = new Set();
          parsed.reviews.forEach(r => {
            if (r.targetType === 'uni') uniSet.add(r.targetId);
            if (r.targetType === 'prof') profSet.add(r.targetId);
          });
          setReviewedUniversities(uniSet);
          setReviewedProfessors(profSet);
        }
        // Use the centralized students store (single source of truth)
        setStudents(getStudents());
      }
    } catch (e) {
      console.error('Failed to load persisted state', e);
    }
  }, []);

  // Listen for external changes to students storage so Dashboard stays in sync with MainPage
  useEffect(() => {
    const handler = (e) => {
      if (!e) return;
      // storage key used by studentData.js
      if (e.key === 'campus_media_students_v1') {
        setStudents(getStudents());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // derive available types dynamically from the programs data
  const availableTypes = useMemo(() => {
    const typesSet = new Set();
    (data || []).forEach((uni) => {
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
  }, [data]);

  // Build a filtered view of universities where programs match the selectedType.
  // Resulting shape: an array of universities with departments that only include matching programs.
  const selectedValues = useMemo(() => {
    return (data || [])
      .map((uni) => {
        const departments = (uni.departments || [])
          .map((dept) => {
            const programs = (dept.programs || []).filter((program) =>
              selectedType === "All" ? true : program.type?.includes(selectedType)
            );

            return { ...dept, programs };
          })
          // drop departments with no matching programs
          .filter((dept) => (dept.programs || []).length > 0);

        return { ...uni, departments };
      })
      // drop universities with no matching departments/programs
      .filter((uni) => (uni.departments || []).length > 0)
      // compute an average program rating per university (useful for charts)
      .map((uni) => {
        const allPrograms = uni.departments.flatMap((d) => d.programs || []);
        const avgProgramRating =
          allPrograms.length > 0
            ? allPrograms.reduce((s, p) => s + (p.rating || 0), 0) /
              allPrograms.length
            : 0;
        return { ...uni, avgProgramRating };
      });
  }, [data, selectedType]);

  if (!currentUser) return <p>Loading...</p>;

  const userRole = currentUser.role || "student"; // default to student for users created via sign-up
  const isGuest = userRole === "guest";
  const isStudent = userRole === "student";
  // Helper to compare university names more robustly (handles minor naming differences)
  const sameUniversity = (a, b) => {
    if (!a || !b) return false;
    const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    const na = normalize(a);
    const nb = normalize(b);

    if (na === nb || na.includes(nb) || nb.includes(na)) return true;

    // Try to match via aliases defined in data.js
    const findCanonical = (nameNorm) => {
      if (!data || !Array.isArray(data)) return null;
      for (const uni of data) {
        const candidates = [uni.name, ...(uni.aliases || [])];
        for (const c of candidates) {
          if (normalize(c) === nameNorm) return uni.name;
        }
      }
      return null;
    };

    const ca = findCanonical(na) || na;
    const cb = findCanonical(nb) || nb;
    return ca === cb || ca.includes(cb) || cb.includes(ca);
  };

  const canUserReviewTarget = (tgt) => {
    if (!isStudent || !tgt) return false;
    if (tgt.type === 'uni') return sameUniversity(currentUser.university, tgt.name);
    if (tgt.type === 'prof') {
      const prof = allProfessors.find(p => p.id === tgt.id);
      return !!prof && sameUniversity(prof.university, currentUser.university);
    }
    return false;
  };

  const deleteMyReview = (targetType, targetId) => {
    // find the review authored by current user for this target
    const idx = reviews.findIndex(r => r.targetType === targetType && r.targetId === targetId && String(r.reviewerId) === String(currentUser.id));
    if (idx === -1) return;
    const newReviews = [...reviews.slice(0, idx), ...reviews.slice(idx + 1)];
    setReviews(newReviews);
    const uniSet = new Set();
    const profSet = new Set();
    newReviews.forEach(r => { if (r.targetType === 'uni') uniSet.add(r.targetId); if (r.targetType === 'prof') profSet.add(r.targetId); });
    setReviewedUniversities(uniSet);
    setReviewedProfessors(profSet);
  try { const state = JSON.parse(localStorage.getItem('campusMediaState')||'{}'); state.data = data; state.reviews = newReviews; localStorage.setItem('campusMediaState', JSON.stringify(state)); } catch(e){console.error(e)}
  };

  return (
    <>
      {!isGuest && <NavBar currentUser={currentUser} />}

      <Container className="dashboard-container mt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h1 className="dashboard-title">University Insights</h1>
            <p className="text-muted mb-0">
              Explore programs, compare universities and view ratings by study
              area.
            </p>
          </Col>
          <Col xs="auto">
            <InputGroup className="type-select">
              <Form.Select
                aria-label="Filter by program type"
                value={selectedType}
                onChange={handleTypeChange}
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Form.Select>
              <Button
                variant="outline-secondary"
                onClick={() => setSelectedType("All")}
              >
                Reset
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Row className="g-3">
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-2">
                  Top Ranked Universities
                </Card.Title>
                <UniversityTable
                  universities={calculateHierarchicalRankings(data)}
                />
              </Card.Body>
            </Card>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Card.Title className="mb-2">Top Ranked Pedagogues</Card.Title>
                  <PedagogueTable
                    top={5}
                    professors={allProfessors.map(p => ({ ...p, rating: getDisplayProfRating(p) }))}
                    reviewedIds={reviewedProfessors}
                    userReviewedIds={userReviewedProfessors}
                    canReview={(p) => (isStudent && sameUniversity(currentUser.university, p.university))}
                  />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title>Ratings by Selected Area</Card.Title>
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

                <UniversityChartByDep
                  areaOfStudy={selectedType}
                  universityData={selectedValues}
                />
              </Card.Body>
            </Card>

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
                                      <div className="text-muted small">
                                        {p.degree} • {p.language} • {p.credits} cr
                                      </div>
                                    </div>
                                    <Badge
                                      bg="success"
                                      className="program-rating"
                                    >
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
                  <p className="text-muted">
                    No programs found for the selected type.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col lg={6} className="mb-3">
            <Card className="shadow-sm h-100 reviews-card">
              <Card.Body>
                <Card.Title>University Ratings & Reviews</Card.Title>
                <p className="text-muted small mb-2">See which universities have ratings and add a review.</p>
                <div className="list-group compact-list">
                  {(data || []).map((uni) => {
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
                            // current user authored a review for this university -> allow edit/delete
                            <div className="d-flex gap-2">
                              <Button size="sm" variant="outline-secondary" onClick={() => openReview('uni', uni.id, uni.name, getDisplayUniRating(uni))}>Edit</Button>
                              <Button size="sm" variant="outline-danger" onClick={() => deleteMyReview('uni', uni.id)}>Delete</Button>
                            </div>
                          ) : canReviewUni ? (
                            // student from same uni who hasn't reviewed yet
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
          </Col>

          <Col lg={6} className="mb-3">
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

                          {/* Reviewer selection removed: reviews are authored by the logged-in student (no selector) */}
                </div>

                <div className="pedagogue-list-scroll">
                  <PedagogueTable
                    top={50}
                    // show professors according to the selected studentUniversity filter.
                    // If 'Any' is selected, show all matched/filtered professors; otherwise
                    // only show professors from the selected university. Reviews remain
                    // write-restricted to students of their own university via canReview.
                    professors={(studentCourses.trim() ? matchedProfessors : filteredProfessors)
                      .filter(p => studentUniversity === 'Any' ? true : sameUniversity(studentUniversity, p.university))
                      .map(p => ({ ...p, rating: getDisplayProfRating(p) }))}
                    onReview={(p) => openReview('prof', p.id, `${p.name} ${p.surname}`, getDisplayProfRating(p))}
                    onDeleteReview={(p) => deleteMyReview('prof', p.id)}
                    reviewedIds={reviewedProfessors}
                    userReviewedIds={userReviewedProfessors}
                    canReview={(p) => (isStudent && sameUniversity(currentUser.university, p.university))}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={reviewModalOpen} onHide={closeReview} centered>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewTarget && (
            <div className="mb-2">
              <strong>{reviewTarget.name}</strong>
              <div className="text-muted small">Current rating: {reviewTarget.currentRating}</div>
            </div>
          )}
          {/* Reviewer selection removed - reviews are tied to the logged-in student */}
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
          <Button variant="secondary" onClick={closeReview}>Cancel</Button>
          {reviewId && (() => {
            const existing = reviews.find(r => r.id === reviewId);
            return existing && String(existing.reviewerId) === String(currentUser.id) ? (
              <Button variant="danger" onClick={() => {
                // delete only if current user is the author
                const newReviews = reviews.filter(r => r.id !== reviewId);
                setReviews(newReviews);
                // update reviewed sets
                const uniSet = new Set();
                const profSet = new Set();
                newReviews.forEach(r => { if (r.targetType === 'uni') uniSet.add(r.targetId); if (r.targetType === 'prof') profSet.add(r.targetId); });
                setReviewedUniversities(uniSet);
                setReviewedProfessors(profSet);
                            try { const state = JSON.parse(localStorage.getItem('campusMediaState')||'{}'); state.data = data; state.reviews = newReviews; localStorage.setItem('campusMediaState', JSON.stringify(state)); } catch(e){console.error(e)}
                closeReview();
              }}>Delete</Button>
            ) : null;
          })()}
          <Button variant="primary" onClick={submitReview} disabled={!canUserReviewTarget(reviewTarget)}>Submit Review</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dashboard;
