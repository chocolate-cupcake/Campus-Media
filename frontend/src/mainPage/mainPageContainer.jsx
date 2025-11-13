import { useState, useEffect } from "react";
import FeedContainer from "./feedContainer.jsx";
import StorieSection from "./StoriesSection";
import AddPostSection from "./addPostSection.jsx";
import { getStudents } from "./studentData.js";

function MainPageContainer() {
  const [currentUser, setCurrentUser] = useState(null);
  const students = getStudents();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  // Keep students in sync if another part of the app updates the students storage
  useEffect(() => {
    const onStorage = (e) => {
      if (!e) return;
      if (e.key === 'campus_media_students_v1') {
        // re-read students and ensure friends and posts reflect the update
        // we don't set currentUser here, just ensure child components that call getStudents will get fresh data
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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
  <div className="container my-4">
    {/* Stories Section - full width */}
    <div className="mb-4">
      <StorieSection />
    </div>

    {/* Feed + Add Post Section - centered */}
    <div className="d-flex flex-column align-items-center">
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
