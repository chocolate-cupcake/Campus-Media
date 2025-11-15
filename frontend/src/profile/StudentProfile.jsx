import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../mainPage/navBar.jsx";
import { Container, Row, Col, Card, Button, Form, Image } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { students as studentData } from "../mainPage/studentData";


function StudentProfile({ student }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(student || null);
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [likes, setLikes] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [comments, setComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postFeeling, setPostFeeling] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const user = student || JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/logIn");
      return;
    }

    setCurrentUser(user);

    // ✅ FIX: Ensure studentData is treated as an array before using .find()
    const dummyList = Array.isArray(studentData)
      ? studentData
      : Array.isArray(studentData.students)
      ? studentData.students
      : [];

    const dummy = dummyList.find(
      (s) => s.email && user.email && s.email.toLowerCase() === user.email.toLowerCase()
    );

    const savedBio = localStorage.getItem(`student_bio_${user.id}`);
    const savedAbout = localStorage.getItem(`student_about_${user.id}`);
    const savedLikes = JSON.parse(localStorage.getItem(`student_likes_${user.id}`) || "{}");
    const savedLikesCount = JSON.parse(localStorage.getItem(`student_likesCount_${user.id}`) || "{}");
    const savedComments = JSON.parse(localStorage.getItem(`student_comments_${user.id}`) || "{}");
    const savedPosts = JSON.parse(localStorage.getItem(`student_posts_${user.id}`) || "[]");

    const effectiveBio =
      savedBio !== null ? savedBio : dummy?.bio ? dummy.bio : "";

    const effectiveAbout =
      savedAbout !== null ? savedAbout : dummy?.about ? dummy.about : "";

    const effectivePosts =
      Array.isArray(savedPosts) && savedPosts.length > 0
        ? savedPosts
        : Array.isArray(dummy?.posts)
        ? dummy.posts
        : [];

    const effectiveLikes =
      savedLikes && Object.keys(savedLikes).length > 0 ? savedLikes : {};

    let effectiveLikesCount =
      savedLikesCount && Object.keys(savedLikesCount).length > 0
        ? savedLikesCount
        : {};

    const effectiveComments =
      savedComments && Object.keys(savedComments).length > 0
        ? savedComments
        : {};

    effectivePosts.forEach((p) => {
      if (!effectiveLikesCount[p.id])
        effectiveLikesCount[p.id] = effectiveLikesCount[p.id] || 0;
    });

    setBio(effectiveBio);
    setAbout(effectiveAbout);
    setLikes(effectiveLikes);
    setLikesCount(effectiveLikesCount);
    setComments(effectiveComments);
    setPosts(effectivePosts);

    setCurrentUser((prev) => ({
      ...prev,
      profileImage: dummy?.profileImage ?? prev.profileImage,
      name: dummy?.name ?? prev.name,
      university: dummy?.university ?? prev.university ?? prev.department,
      department: dummy?.department ?? prev.department,
    }));
  }, [navigate, student]);

  if (!currentUser) return null;

  const saveBio = () => {
    localStorage.setItem(`student_bio_${currentUser.id}`, bio);
    setEditingBio(false);
  };

  const saveAbout = () => {
    localStorage.setItem(`student_about_${currentUser.id}`, about);
    setEditingAbout(false);
  };

  const toggleLike = (postId) => {
    const updated = { ...likes, [postId]: !likes[postId] };
    setLikes(updated);
    localStorage.setItem(`student_likes_${currentUser.id}`, JSON.stringify(updated));

    setLikesCount((prev) => {
      const wasLiked = !!likes[postId];
      const prevCount = prev[postId] || 0;
      const nextCount = wasLiked ? Math.max(prevCount - 1, 0) : prevCount + 1;
      const updatedCounts = { ...prev, [postId]: nextCount };
      localStorage.setItem(`student_likesCount_${currentUser.id}`, JSON.stringify(updatedCounts));
      return updatedCounts;
    });
  };

  const submitComment = (postId) => {
    const text = (newCommentText[postId] || "").trim();
    if (!text) return;
    const postComments = comments[postId] ? [...comments[postId]] : [];
    postComments.push({ id: Date.now(), text, date: new Date().toISOString() });

    const updated = { ...comments, [postId]: postComments };
    setComments(updated);
    localStorage.setItem(`student_comments_${currentUser.id}`, JSON.stringify(updated));
    setNewCommentText((s) => ({ ...s, [postId]: "" }));
  };

  const deletePost = (postId) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    localStorage.setItem(`student_posts_${currentUser.id}`, JSON.stringify(updated));

    const newLikes = { ...likes };
    const newLikesCount = { ...likesCount };
    const newComments = { ...comments };
    const newInput = { ...newCommentText };

    delete newLikes[postId];
    delete newLikesCount[postId];
    delete newComments[postId];
    delete newInput[postId];

    setLikes(newLikes);
    setLikesCount(newLikesCount);
    setComments(newComments);
    setNewCommentText(newInput);
  };

  const createPost = () => {
    if (!postText && !postImage) return;
    const newPost = {
      id: Date.now(),
      text: postText,
      image: postImage,
      feeling: postFeeling,
      location: postLocation,
      date: new Date().toLocaleString(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem(`student_posts_${currentUser.id}`, JSON.stringify(updated));

    setLikesCount((prev) => {
      const updatedCounts = { ...prev, [newPost.id]: 0 };
      localStorage.setItem(`student_likesCount_${currentUser.id}`, JSON.stringify(updatedCounts));
      return updatedCounts;
    });

    setPostText("");
    setPostImage(null);
    setPostFeeling("");
    setPostLocation("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPostImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const emojiList = ["😊", "😂", "😎", "😍", "🤔", "🥳", "😭", "❤️"];

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = `Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)}`;
        setPostLocation(loc);
      });
    } else {
      alert("Geolocation not supported.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar currentUser={currentUser} />
      <Container className="mt-4 mb-5">
        <Card className="mb-4 p-3">
          <Row className="align-items-center">
            <Col xs="auto">
              <Image
                src={currentUser.profileImage}
                roundedCircle
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </Col>
            <Col>
              <h4 className="mb-1">{currentUser.name}</h4>
              <div className="text-muted mb-2">
                {currentUser.university || currentUser.department}
              </div>

              {!editingBio ? (
                <>
                  <div>{bio || "No bio yet."}</div>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="mt-2"
                    onClick={() => setEditingBio(true)}
                  >
                    Edit Bio
                  </Button>
                </>
              ) : (
                <>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="mb-2"
                  />
                  <>
                    <Button size="sm" onClick={saveBio}>
                      Save
                    </Button>{" "}
                    <Button size="sm" variant="light" onClick={() => setEditingBio(false)}>
                      Cancel
                    </Button>
                  </>
                </>
              )}
            </Col>
          </Row>
        </Card>

        <Card className="p-3 mb-4">
          <div className="d-flex align-items-center mb-2">
            <Image
              src={currentUser.profileImage}
              roundedCircle
              style={{ width: 50, height: 50 }}
            />
            <Form.Control
              className="ms-3"
              placeholder={`What's on your mind, ${
                currentUser.name.split(" ")[0]
              }?`}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </div>

          {postImage && (
            <div className="text-center mb-2">
              <Image src={postImage} fluid rounded style={{ maxHeight: "250px" }} />
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button variant="link" onClick={() => fileInputRef.current.click()}>
                📷 Photo
              </Button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                variant="link"
                onClick={() => setPostFeeling(postFeeling ? "" : "😊")}
              >
                😊 Feeling
              </Button>
              <Button variant="link" onClick={handleLocation}>
                📍 Location
              </Button>
            </div>
            <Button onClick={createPost}>Post</Button>
          </div>

          {postFeeling && (
            <div className="mt-2">
              {["😊", "😂", "😎", "😍", "🤔", "🥳", "😭", "❤️"].map((e) => (
                <Button
                  key={e}
                  variant={e === postFeeling ? "primary" : "outline-secondary"}
                  size="sm"
                  className="me-1"
                  onClick={() => setPostFeeling(e)}
                >
                  {e}
                </Button>
              ))}
            </div>
          )}
        </Card>

        <Row>
          <Col md={8}>
            {posts.length === 0 && <p>No posts yet.</p>}

            {posts.map((p) => (
              <Card className="mb-3" key={p.id}>
                {p.image && <Card.Img variant="top" src={p.image} />}

                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <Image
                      src={currentUser.profileImage}
                      roundedCircle
                      style={{ width: 36, height: 36 }}
                    />
                    <div className="ms-2">
                      <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
                      <small className="text-muted">{p.date}</small>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="ms-auto text-danger p-0"
                      onClick={() => deletePost(p.id)}
                      title="Delete post"
                    >
                      <FaTrash size={16} />
                    </Button>
                  </div>

                  <Card.Text>{p.text}</Card.Text>
                  {p.feeling && <div>Feeling {p.feeling}</div>}
                  {p.location && <div className="text-muted">📍 {p.location}</div>}

                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <Button variant="link" onClick={() => toggleLike(p.id)}>
                      <span
                        style={{
                          fontSize: 20,
                          color: likes[p.id] ? "crimson" : "grey",
                        }}
                      >
                        {likes[p.id] ? "❤️" : "🤍"}
                      </span>
                      <span className="ms-2">{likesCount[p.id] || 0}</span>
                    </Button>

                    <span>{comments[p.id]?.length || 0} comments</span>
                  </div>

                  {(comments[p.id] || []).map((c) => (
                    <div key={c.id} className="mb-2">
                      <strong>{currentUser.name}</strong>{" "}
                      <small className="text-muted">
                        {new Date(c.date).toLocaleString()}
                      </small>
                      <div>{c.text}</div>
                    </div>
                  ))}

                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitComment(p.id);
                    }}
                    className="d-flex mt-2"
                  >
                    <Form.Control
                      placeholder="Write a comment..."
                      value={newCommentText[p.id] || ""}
                      onChange={(e) =>
                        setNewCommentText((s) => ({
                          ...s,
                          [p.id]: e.target.value,
                        }))
                      }
                    />
                    <Button type="submit" variant="primary" className="ms-2">
                      Comment
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            ))}
          </Col>

          <Col md={4}>
            <Card className="p-3">
              <h6>About</h6>
              {!editingAbout ? (
                <>
                  <div>{about || "No about info yet."}</div>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="mt-2"
                    onClick={() => setEditingAbout(true)}
                  >
                    Edit About
                  </Button>
                </>
              ) : (
                <>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="mb-2"
                  />
                  <Button size="sm" onClick={saveAbout}>
                    Save
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => setEditingAbout(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default StudentProfile;
