import { useState, useEffect } from "react";
import FeedContainer from "./feedContainer.jsx";
import StorieSection from "./StoriesSection";
import AddPostSection from "./addPostSection.jsx";
import { getCurrentUser, getFeedPosts, getFriends } from "../services/api.js";

function MainPageContainer() {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try session storage first
        const cached = sessionStorage.getItem("currentUser");
        if (cached) {
          setCurrentUser(JSON.parse(cached));
        }

        // Fetch current user and feed data
        const [user, postsData, friendsData] = await Promise.all([
          getCurrentUser(),
          getFeedPosts(),
          getFriends(),
        ]);

        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }

        if (postsData) setFeedPosts(postsData);
        if (friendsData) setFriends(friendsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle post updates (e.g., after like/unlike)
  const handlePostUpdate = (updatedPost) => {
    setFeedPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post,
      ),
    );
  };

  // Handle new post creation
  const handleNewPost = (newPost) => {
    setFeedPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (loading || !currentUser) return <p>Loading...</p>;

  // Use feedPosts from API, or combine from local data if needed
  const allPosts =
    feedPosts.length > 0
      ? feedPosts
      : [
          ...friends.flatMap((friend) =>
            (friend.posts || []).map((post) => ({
              ...post,
              likes: post.likes || [],
              comments: post.comments || [],
              posterName: friend.name,
              posterImage: friend.profileImage,
              posterId: friend.id,
            })),
          ),
          ...(currentUser.posts || []).map((post) => ({
            ...post,
            likes: post.likes || [],
            comments: post.comments || [],
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
            onNewPost={handleNewPost}
          />
          <FeedContainer
            posts={allPosts}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onPostUpdate={handlePostUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default MainPageContainer;
