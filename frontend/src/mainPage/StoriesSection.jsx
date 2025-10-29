import { useState } from "react";
import uniDummyStory from "../assets/uniDummyStory.jpg";
import uniDummyStory1 from "../assets/uniDummyStory1.jpg";
import uniDummyStory2 from "../assets/uniDummyStory2.jpg";

function StorieSection() {
  const [viewedStories, setViewedStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const stories = [
    { username: "Marko_Epoka", image: uniDummyStory },
    { username: "Jordy_FSHN", image: uniDummyStory1 },
    { username: "Ana_UFO", image: uniDummyStory2 },
  ];

  const handleStoryClick = (index) => {
    const story = stories[index];
    if (!viewedStories.includes(story.username)) {
        {/* Here i create a new array same as the viewedStories but
            i append in the end the next story (to mark it as viewed) so
            the spread opearotr from JS (...) actually creates a copy of the viewed storys `
            and prev means the previous state from UseState */}
      setViewedStories((prev) => [...prev, story.username]);
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

        // mark as viewed
        setViewedStories((prevViewed) =>
          prevViewed.includes(newStory.username)
            ? prevViewed
            : [...prevViewed, newStory.username]
        );

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

        setViewedStories((prevViewed) =>
          prevViewed.includes(newStory.username)
            ? prevViewed
            : [...prevViewed, newStory.username]
        );

        return newIndex;
      }
      return prev;
    });
  };

  // Define the currently active story
  const activeStory =
    activeIndex !== null ? stories[activeIndex] : null;

  return (
    <>
      {/* Stories Section */}
      <div
        className="d-flex gap-4 overflow-auto px-4 py-3 bg-light rounded-3 shadow-sm"
        style={{
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
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
          const isViewed = viewedStories.includes(story.username);
          const ringColor = isViewed ? "#adb5bd" : "#0d6efd"; // viewed vs new

          return (
            <div
              key={story.username}
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
                className="mt-2 text-secondary text-truncate"
                style={{
                  width: "85px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
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
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Story image */}
            <img
              src={activeStory.image}
              alt={activeStory.username}
              className="w-100"
              style={{
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />

            {/* Username overlay */}
            <div
              className="position-absolute bottom-0 w-100 text-center bg-dark bg-opacity-50 text-white py-2"
              style={{ fontWeight: "500" }}
            >
              {activeStory.username}
            </div>

            {/* Close button */}
            <button
              type="button"
              className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Left Arrow */}
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

            {/* Right Arrow */}
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
