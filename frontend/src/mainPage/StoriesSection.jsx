import { useState, useEffect } from "react";
import {
  getStories,
  getCurrentUser,
  markStoryViewed,
} from "../services/api.js";

function StorieSection() {
  const [viewedStories, setViewedStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try session storage first
        const cached = sessionStorage.getItem("currentUser");
        if (cached) {
          setCurrentUser(JSON.parse(cached));
        }

        const [user, storiesData] = await Promise.all([
          getCurrentUser(),
          getStories(),
        ]);

        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
        if (storiesData) {
          setStories(storiesData);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Don't load stories until data is available
  if (loading || !currentUser) return <p>Loading...</p>;

  const handleStoryClick = async (index) => {
    const story = stories[index];
    if (!viewedStories.includes(story.id)) {
      setViewedStories((prev) => [...prev, story.id]);
      try {
        await markStoryViewed(story.id);
      } catch (error) {
        console.error("Failed to mark story as viewed:", error);
      }
    }
    setActiveIndex(index);
  };

  const closeModal = () => setActiveIndex(null);

  const goToNextStory = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => {
      if (prev < stories.length - 1) {
        const newIndex = prev + 1;
        const newStory = stories[newIndex];
        if (!viewedStories.includes(newStory.id)) {
          setViewedStories((prevViewed) => [...prevViewed, newStory.id]);
        }
        return newIndex;
      }
      return prev;
    });
  };

  const goToPrevStory = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => {
      if (prev > 0) {
        const newIndex = prev - 1;
        const newStory = stories[newIndex];
        if (!viewedStories.includes(newStory.id)) {
          setViewedStories((prevViewed) => [...prevViewed, newStory.id]);
        }
        return newIndex;
      }
      return prev;
    });
  };

  const activeStory = activeIndex !== null ? stories[activeIndex] : null;

  return (
    <>
      {/* Stories Row */}
      <div
        className="d-flex gap-4 overflow-auto px-4 py-3 rounded-3 shadow-sm"
        style={{
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          backgroundColor: "#E8F1FF",
          borderBottom: "2px solid #B8D4F1",
        }}
      >
        <style>
          {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
        </style>

        {stories.map((story, index) => {
          const isViewed = viewedStories.includes(story.id);
          const ringColor = isViewed ? "#adb5bd" : "#4A90E2";

          return (
            <div
              key={story.id}
              className="text-center"
              onClick={() => handleStoryClick(index)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="p-1 rounded-circle d-inline-block shadow-sm"
                style={{
                  background: ringColor,
                  padding: "3px",
                  transition: "background 0.3s ease",
                }}
              >
                <img
                  src={story.image}
                  alt={story.username}
                  className="rounded-circle border border-3 border-white"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <p
                className="mt-2 text-truncate"
                style={{
                  width: "85px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  color: "#2C5AA0",
                }}
              >
                {story.username}
              </p>
            </div>
          );
        })}
      </div>

      {/* Story Modal */}
      {activeStory && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
          style={{ zIndex: 1050 }}
          onClick={closeModal}
        >
          <div
            className="position-relative d-flex justify-content-center align-items-center"
            style={{
              maxWidth: "400px",
              width: "90%",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeStory.image}
              alt={activeStory.username}
              className="w-100"
              style={{
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />

            <div
              className="position-absolute bottom-0 w-100 text-center bg-dark bg-opacity-50 text-white py-2"
              style={{ fontWeight: "500" }}
            >
              {activeStory.username}
            </div>

            {/* Close */}
            <button
              type="button"
              className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Prev */}
            {activeIndex > 0 && (
              <button
                type="button"
                className="btn btn-light position-absolute start-0 top-50 translate-middle-y rounded-circle shadow-sm"
                style={{ opacity: 0.8 }}
                onClick={goToPrevStory}
              >
                ‹
              </button>
            )}

            {/* Next */}
            {activeIndex < stories.length - 1 && (
              <button
                type="button"
                className="btn btn-light position-absolute end-0 top-50 translate-middle-y rounded-circle shadow-sm"
                style={{ opacity: 0.8 }}
                onClick={goToNextStory}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default StorieSection;
