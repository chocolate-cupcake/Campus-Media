import { useState, useEffect } from "react";
import FeedContainer from "./feedContainer.jsx";
import StorieSection from "./StoriesSection";
import AddPostSection from "./addPostSection.jsx";
import { getStudents, updateStudent } from "./studentData.js";

function MainPageContainer() {
  const [currentUser, setCurrentUser] = useState(null);
  const students = getStudents();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  if (!currentUser) return <p>Loading...</p>;

  // Get only friends
  const friends = students.filter((student) =>
    currentUser.friends.includes(student.id)
  );

  // Combine all friend posts + user’s own posts
  const friendPosts = [
    ...friends.flatMap((friend) =>
      friend.posts.map((post) => ({
        ...post,
        posterName: friend.name,
        posterImage: friend.profileImage,
        posterId: friend.id,
      }))
    ),
    ...currentUser.posts.map((post) => ({
      ...post,
      posterName: currentUser.name,
      posterImage: currentUser.profileImage,
      posterId: currentUser.id,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="container-fluid p-0">
      {" "}
      {/* full width, no padding */}
      {/* Stories Section - full width */}
      <StorieSection />
      {/* Feed + Add Post Section - centered */}
      <div className="d-flex flex-column align-items-center mt-3">
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <AddPostSection
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
          <FeedContainer
            posts={friendPosts}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </div>
      </div>
    </div>
  );
}

export default MainPageContainer;
