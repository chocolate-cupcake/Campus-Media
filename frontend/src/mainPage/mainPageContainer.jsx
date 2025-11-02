import FeedContainer from "./feedContainer.jsx";
import StorieSection from "./StoriesSection";
import { students } from "./studentData.js";

function MainPageContainer() {
  // Simulated logged-in student (Alice)
  const currentUser = students.find((student) => student.id === 1);

  // Get only this user's friends
  const friends = students.filter((student) =>
    currentUser.friends.includes(student.id)
  );

  // Collect all posts from friends
  const friendPosts = friends.flatMap((friend) => friend.posts);

  return (
    <div className="container my-4 d-flex flex-column align-items-center">
      {/* Stories Section */}
      <div className="">
        <StorieSection />
      </div>

      {/* Add Post Section */}
      <div className="card w-100 mb-4" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <textarea
            className="form-control"
            rows="3"
            placeholder="What's on your mind..."
          ></textarea>
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-primary">Post</button>
        </div>
      </div>

      {/* Feed Section — show friends' posts only */}
      <div className="d-flex flex-column align-items-center w-100">
        <FeedContainer posts={friendPosts} />
      </div>
    </div>
  );
}

export default MainPageContainer;
