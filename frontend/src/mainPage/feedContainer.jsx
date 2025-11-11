import { useState } from "react";
import notLikedIcon from "../assets/notLikedIcon.png";
import likedIcon from "../assets/likedIcon.png";
import commentIcon from "../assets/commentIcon.png";
import trashIcon from "../assets/trashIcon.png"; 
import { updateStudent } from "./studentData.js";

function FeedContainer({ posts, currentUser, setCurrentUser }) {
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (id) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeletePost = (postId) => {
    if (!currentUser) return;

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const updatedPosts = currentUser.posts.filter((p) => p.id !== postId);
    const updatedUser = { ...currentUser, posts: updatedPosts };

    // Update everywhere
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    updateStudent(currentUser.id, updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {posts.map((post) => (
        <div
          key={`${post.posterId}-${post.id}`}
          className="card mb-4 shadow-sm"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          {/* Header: Poster Info */}
          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center gap-2">
              <img
                src={post.posterImage}
                alt={post.posterName}
                className="rounded-circle"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <div>
                <span className="fw-semibold d-block">{post.posterName}</span>
                <small className="text-muted">{post.date}</small>
              </div>
            </div>

            {/* Delete Button (only for current user's posts) */}
            {currentUser && post.posterId === currentUser.id && (
              <button
                className="btn btn-link text-danger p-0"
                onClick={() => handleDeletePost(post.id)}
                title="Delete post"
              >
                <img
                  src={trashIcon}
                  alt="delete"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
            )}
          </div>

          {/* Post Image (only if exists) */}
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="card-img-top img-fluid"
              style={{
                maxHeight: "450px",
                objectFit: "cover",
              }}
            />
          )}

          <div className="card-body">
            {/* Buttons Row */}
            <div className="d-flex align-items-center gap-3 mb-2">
              <button
                className="postsButtons"
                onClick={() => toggleLike(`${post.posterId}-${post.id}`)}
              >
                <img
                  className="postsIcons"
                  src={
                    likedPosts[`${post.posterId}-${post.id}`]
                      ? likedIcon
                      : notLikedIcon
                  }
                  alt="like"
                />
              </button>

              <button className="postsButtons">
                <img className="postsIcons" src={commentIcon} alt="comment" />
              </button>
            </div>

            {/* Likes */}
            <p className="text-muted small mb-1">
              {likedPosts[`${post.posterId}-${post.id}`]
                ? "You and 12 others liked this"
                : "12 likes"}
            </p>

            {/* Caption */}
            {post.caption && (
              <p className="card-text mb-0">{post.caption}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedContainer;
