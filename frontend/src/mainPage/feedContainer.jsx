import React from "react";

function FeedContainer({ posts }) {
  return (
    <div className="d-flex flex-column align-items-center w-100">
      {posts.map((post) => (
        <div key={post.id} className="card mb-4" style={{ maxWidth: "600px", width: "100%" }}>
          <img
            src={post.image}
            alt={post.caption}
            className="card-img-top img-fluid"
          />
          <div className="card-body">
            <p className="card-text">{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedContainer;
