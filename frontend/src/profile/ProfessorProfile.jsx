import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../mainPage/navBar.jsx";
import { Container, Row, Col, Card, Button, Form, Image } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import api from "../services/api";

function ProfessorProfile({ professor }) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);

  const [likes, setLikes] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [comments, setComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postFeeling, setPostFeeling] = useState("");
  const [postLocation, setPostLocation] = useState("");

  const fileInputRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      const user = professor || JSON.parse(localStorage.getItem("currentUser"));

      if (!user) {
        navigate("/logIn");
        return;
      }

      setCurrentUser(user);
      setLoading(true);

      try {
        const profileData = await api.getUserProfile(user.id);
        
        setBio(profileData.bio || "");
        setAbout(profileData.about || "");

        setCurrentUser((prev) => ({
          ...prev,
          profileImage: profileData.profileImage ?? prev.profileImage,
          name: profileData.name ?? prev.name,
        }));

        const postsData = await api.getProfilePosts(user.id);

        const normalizedPosts = postsData.map(post => ({
          id: post.postId || post.PostId || post.id,
          userId: post.userId || post.UserId,
          image: post.image || post.Image,
          caption: post.caption || post.Caption,
          text: post.caption || post.Caption || post.text,
          date: post.date || post.Date,
          feeling: post.feeling || post.Feeling,
          location: post.location || post.Location,
          comments: post.comments || post.Comments || [],
          likesCount: post.likesCount || 0,
          isLikedByCurrentUser: post.isLikedByCurrentUser || false
        }));

        normalizedPosts.sort((a, b) => b.id - a.id);

        setPosts(normalizedPosts || []);

        const initialLikes = {};
        const initialLikesCount = {};
        const initialComments = {};

        normalizedPosts.forEach((post) => {
          initialLikesCount[post.id] = post.likesCount || 0;
          initialLikes[post.id] = post.isLikedByCurrentUser || false;
          initialComments[post.id] = post.comments || [];
        });

        setLikes(initialLikes);
        setLikesCount(initialLikesCount);
        setComments(initialComments);

      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, professor]);

  if (!currentUser || loading) return <div>Loading...</div>;

  const saveBio = async () => {
    try {
      await api.updateUserBio(currentUser.id, bio);
      setEditingBio(false);
    } catch (error) {
      console.error("Error saving bio:", error);
      alert("Failed to save bio. Please try again.");
    }
  };

  const saveAbout = async () => {
    try {
      await api.updateUserAbout(currentUser.id, about);
      setEditingAbout(false);
    } catch (error) {
      console.error("Error saving about:", error);
      alert("Failed to save about section. Please try again.");
    }
  };

  const toggleLike = (postId) => {
    const wasLiked = !!likes[postId];
    
    const updatedLikes = { ...likes, [postId]: !wasLiked };
    setLikes(updatedLikes);

    setLikesCount((prev) => {
      const prevCount = prev[postId] || 0;
      const nextCount = wasLiked ? Math.max(prevCount - 1, 0) : prevCount + 1;
      return { ...prev, [postId]: nextCount };
    });
  };

  const submitComment = async (postId) => {
    const text = (newCommentText[postId] || "").trim();
    if (!text) return;

    try {
      const nameParts = currentUser.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const newComment = await api.addComment({
        postId: postId,
        userName: firstName,
        userSurname: lastName,
        commentText: text,
      });

      const postComments = comments[postId] ? [...comments[postId]] : [];
      postComments.push(newComment);

      setComments({ ...comments, [postId]: postComments });
      setNewCommentText((s) => ({ ...s, [postId]: "" }));
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.deletePost(postId);

      const updatedPosts = posts.filter((p) => p.id !== postId);
      setPosts(updatedPosts);

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
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const createPost = async () => {
    if (!postText && !postImage) return;

    try {
      const postData = {
        Image: postImage || "",
        Caption: postText || "",
      };

      if (postFeeling) {
        postData.Feeling = postFeeling;
      }
      if (postLocation) {
        postData.Location = postLocation;
      }

      const newPost = await api.createProfilePost(currentUser.id, postData);

      const normalizedPost = {
        id: newPost.postId || newPost.PostId || newPost.id,
        userId: newPost.userId || newPost.UserId,
        image: newPost.image || newPost.Image || "",
        caption: newPost.caption || newPost.Caption || "",
        text: newPost.caption || newPost.Caption || newPost.text || "",
        date: newPost.date || newPost.Date,
        feeling: newPost.feeling || newPost.Feeling || "",
        location: newPost.location || newPost.Location || "",
        comments: [],
        likesCount: 0,
        isLikedByCurrentUser: false
      };

      setPosts([normalizedPost, ...posts]);
      setLikesCount((prev) => ({ ...prev, [normalizedPost.id]: 0 }));
      setComments((prev) => ({ ...prev, [normalizedPost.id]: [] }));

      setPostText("");
      setPostImage(null);
      setPostFeeling("");
      setPostLocation("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPostImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

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

  const emojiList = ["😊", "😂", "😎", "😍", "🤔", "🥳", "😭", "❤️"];

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
                  <Button size="sm" onClick={saveBio}>
                    Save
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => setEditingBio(false)}
                  >
                    Cancel
                  </Button>
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
              placeholder={`What's on your mind, Prof. ${
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
              {emojiList.map((e) => (
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
                      <strong>{c.userName} {c.userSurname}</strong>{" "}
                      <small className="text-muted">
                        {new Date(c.date).toLocaleString()}
                      </small>
                      <div>{c.commentText}</div>
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

export default ProfessorProfile;