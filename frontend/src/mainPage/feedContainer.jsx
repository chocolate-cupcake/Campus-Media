import { useState } from "react";
import notLikedIcon from "../assets/notLikedIcon.png";
import likedIcon from "../assets/likedIcon.png";
import commentIcon from "../assets/commentIcon.png";

function FeedContainer({ posts }) {
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (id) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {posts.map((post) => (
        <div
          key={post.id}
          className="card mb-4 shadow-sm"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <img
            src={post.image}
            alt={post.caption}
            className="card-img-top img-fluid"
          />

          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-2">
              <button
                className="postsButtons"
                onClick={() => toggleLike(post.id)}
              >
                <img
                  className="postsIcons"
                  src={likedPosts[post.id] ? likedIcon : notLikedIcon}
                  alt="like"
                />
              </button>

              <button className="postsButtons">
                <img
                  className="postsIcons"
                  src={commentIcon}
                  alt="comment"
                />
              </button>
            </div>

            <p className="text-muted small mb-1">
              {likedPosts[post.id] ? "You and 12 others liked this" : "12 likes"}
            </p>

            <p className="card-text">{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedContainer;
