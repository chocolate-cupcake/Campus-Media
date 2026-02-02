import { useState } from "react";
import notLikedIcon from "../assets/notLikedIcon.png";
import likedIcon from "../assets/likedIcon.png";
import trashIcon from "../assets/trashIcon.png";
import { FaRegComment, FaTrash } from "react-icons/fa";
import {
  deletePost as apiDeletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment as apiDeleteComment,
} from "../services/api.js";
import ProfileLink from "../profile/ProfileLink.jsx";

function FeedContainer({ posts, currentUser, setCurrentUser, onPostUpdate }) {
  const [likingInProgress, setLikingInProgress] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  // Helper to check if current user liked a post
  const isLikedByUser = (post) => {
    const likes = post.likes || [];
    return likes.includes(currentUser?.id);
  };

  // Helper to get likes count
  const getLikesCount = (post) => {
    return (post.likes || []).length;
  };

  // Helper to get comments
  const getComments = (post) => {
    return post.comments || [];
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Submit a new comment
  const submitComment = async (post) => {
    const text = (newCommentText[post.id] || "").trim();
    if (!text || !currentUser) return;

    setSubmittingComment((prev) => ({ ...prev, [post.id]: true }));

    try {
      const nameParts = currentUser.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const newComment = await addComment({
        postId: post.id,
        userName: firstName,
        userSurname: lastName,
        commentText: text,
      });

      // Update post with new comment
      const updatedComments = [...getComments(post), newComment];
      if (onPostUpdate) {
        onPostUpdate({ ...post, comments: updatedComments });
      }

      // Clear input
      setNewCommentText((prev) => ({ ...prev, [post.id]: "" }));
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [post.id]: false }));
    }
  };

  // Delete a comment
  const handleDeleteComment = async (post, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await apiDeleteComment(commentId);

      const updatedComments = getComments(post).filter(
        (c) => c.id !== commentId,
      );
      if (onPostUpdate) {
        onPostUpdate({ ...post, comments: updatedComments });
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const toggleLike = async (post) => {
    if (!currentUser || likingInProgress[post.id]) return;

    const isLiked = isLikedByUser(post);
    const currentLikes = post.likes || [];

    // Optimistic update - immediately update UI
    const optimisticLikes = isLiked
      ? currentLikes.filter((id) => id !== currentUser.id)
      : [...currentLikes, currentUser.id];

    if (onPostUpdate) {
      onPostUpdate({ ...post, likes: optimisticLikes });
    }

    setLikingInProgress((prev) => ({ ...prev, [post.id]: true }));

    try {
      const updatedPost = isLiked
        ? await unlikePost(post.id)
        : await likePost(post.id);

      // Update with server response
      if (onPostUpdate && updatedPost) {
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert optimistic update on error
      if (onPostUpdate) {
        onPostUpdate({ ...post, likes: currentLikes });
      }
    } finally {
      setLikingInProgress((prev) => ({ ...prev, [post.id]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!currentUser) return;

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await apiDeletePost(postId);

      const updatedPosts = currentUser.posts.filter((p) => p.id !== postId);
      const updatedUser = { ...currentUser, posts: updatedPosts };

      // Update session storage and state
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again.");
    }
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
              <ProfileLink userId={post.posterId}>
                <img
                  src={post.posterImage}
                  alt={post.posterName}
                  className="rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </ProfileLink>

              <div>
                <span className="fw-semibold d-block">
                  {post.posterName}
                  {post.feeling && (
                    <span className="text-muted fw-normal">
                      {" "}
                      is feeling {post.feeling}
                    </span>
                  )}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">{post.date}</small>
                  {post.location && (
                    <small className="text-muted">{post.location}</small>
                  )}
                </div>
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
                onClick={() => toggleLike(post)}
                disabled={likingInProgress[post.id]}
              >
                <img
                  className="postsIcons"
                  src={isLikedByUser(post) ? likedIcon : notLikedIcon}
                  alt="like"
                />
              </button>

              <button
                className="postsButtons"
                onClick={() => toggleComments(post.id)}
              >
                <FaRegComment size={22} color="#6c757d" />
              </button>
            </div>

            {/* Likes and Comments Count */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <p className="text-muted small mb-0">
                {getLikesCount(post) > 0
                  ? isLikedByUser(post)
                    ? getLikesCount(post) === 1
                      ? "You liked this"
                      : `You and ${getLikesCount(post) - 1} others liked this`
                    : `${getLikesCount(post)} ${getLikesCount(post) === 1 ? "like" : "likes"}`
                  : "Be the first to like this"}
              </p>
              <button
                className="btn btn-link text-muted small p-0"
                onClick={() => toggleComments(post.id)}
              >
                {expandedComments[post.id]
                  ? `${getComments(post).length} comments`
                  : getComments(post).length > 0
                    ? `View all ${getComments(post).length} comments`
                    : "0 comments"}
              </button>
            </div>

            {/* Caption */}
            {post.caption && <p className="card-text mb-2">{post.caption}</p>}

            {/* Comments Section */}
            {(expandedComments[post.id] || getComments(post).length > 0) && (
              <div className="border-top pt-3">
                {/* Existing Comments */}
                {getComments(post).length > 0 && (
                  <div className="mb-3">
                    {(() => {
                      const postComments = getComments(post);
                      const isExpanded = expandedComments[post.id];
                      const commentsToShow = isExpanded
                        ? postComments
                        : postComments.slice(0, 1);

                      return (
                        <>
                          {commentsToShow.map((comment, index) => (
                            <div key={comment.id || index} className="mb-2">
                              <div className="d-flex align-items-start gap-2">
                                <div
                                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {(comment.userName || "U")[0]}
                                </div>
                                <div className="flex-grow-1 bg-light rounded p-2 d-flex justify-content-between align-items-start">
                                  <div>
                                    <strong className="small">
                                      {comment.userName} {comment.userSurname}
                                    </strong>
                                    <small className="text-muted ms-2">
                                      {comment.date
                                        ? new Date(
                                            comment.date,
                                          ).toLocaleDateString()
                                        : ""}
                                    </small>
                                    <p className="mb-0 small">
                                      {comment.commentText}
                                    </p>
                                  </div>
                                  <button
                                    className="btn btn-link p-0 text-danger"
                                    onClick={() =>
                                      handleDeleteComment(post, comment.id)
                                    }
                                    title="Delete comment"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {postComments.length > 1 && !isExpanded && (
                            <button
                              className="btn btn-link text-muted small p-0"
                              onClick={() => toggleComments(post.id)}
                            >
                              View all {postComments.length} comments
                            </button>
                          )}
                          {isExpanded && postComments.length > 1 && (
                            <button
                              className="btn btn-link text-muted small p-0"
                              onClick={() => toggleComments(post.id)}
                            >
                              Hide comments
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Write a comment..."
                    value={newCommentText[post.id] || ""}
                    onChange={(e) =>
                      setNewCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submitComment(post);
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => submitComment(post)}
                    disabled={
                      submittingComment[post.id] ||
                      !(newCommentText[post.id] || "").trim()
                    }
                  >
                    {submittingComment[post.id] ? "..." : "Post"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedContainer;
