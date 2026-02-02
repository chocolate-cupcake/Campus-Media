import { useState } from "react";
import { createProfilePost } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import ProfileLink from "../profile/ProfileLink.jsx";

// Import icons
import { FaImage, FaSmile, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import Buttons from "../mainPage/Buttons.jsx";

// Feeling options
const FEELINGS = [
  "😊 Happy",
  "😢 Sad",
  "😍 Loved",
  "😎 Cool",
  "😤 Angry",
  "🤔 Thoughtful",
  "😴 Tired",
  "🎉 Excited",
  "😌 Relaxed",
  "💪 Motivated",
];

function AddPostSection({ currentUser, setCurrentUser, onNewPost }) {
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [postFeeling, setPostFeeling] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPostImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPostImage(null);
    setImagePreview(null);
  };

  const handleFeelingSelect = (feeling) => {
    setPostFeeling(feeling);
    setShowFeelingPicker(false);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = `📍 Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)}`;
          setPostLocation(loc);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback: prompt user to enter location manually
          const manualLocation = prompt("Enter your location:");
          if (manualLocation) {
            setPostLocation(`📍 ${manualLocation}`);
          }
        },
      );
    } else {
      const manualLocation = prompt(
        "Geolocation not supported. Enter your location:",
      );
      if (manualLocation) {
        setPostLocation(`📍 ${manualLocation}`);
      }
    }
  };

  const handleAddPost = async () => {
    if (!postText.trim() && !postImage && !postFeeling && !postLocation) return;

    setLoading(true);

    try {
      const postData = {
        Image: postImage || "",
        Caption: postText,
      };

      // Add feeling and location if set
      if (postFeeling) {
        postData.Feeling = postFeeling;
      }
      if (postLocation) {
        postData.Location = postLocation;
      }

      const newPost = await createProfilePost(currentUser.id, postData);

      // Normalize the response
      const normalizedPost = {
        id: newPost.postId || newPost.PostId || newPost.id,
        image: newPost.image || newPost.Image || "",
        caption: newPost.caption || newPost.Caption || "",
        date:
          newPost.date ||
          newPost.Date ||
          new Date().toISOString().split("T")[0],
        feeling: newPost.feeling || newPost.Feeling || "",
        location: newPost.location || newPost.Location || "",
        likes: [],
        posterName: currentUser.name,
        posterImage: currentUser.profileImage,
        posterId: currentUser.id,
      };

      // Notify parent component about the new post
      if (onNewPost) {
        onNewPost(normalizedPost);
      }

      // Reset form
      setPostText("");
      setPostImage(null);
      setImagePreview(null);
      setPostFeeling("");
      setPostLocation("");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card w-100 mb-4 shadow-sm border-0"
      style={{
        maxWidth: "600px",
        borderRadius: "16px",
      }}
    >
      <div className="card-body">
        <div className="d-flex align-items-start gap-2 mb-3">
          {/* ✅ Clickable profile picture */}
          <ProfileLink userId={currentUser?.id}>
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="rounded-circle"
              style={{
                width: "45px",
                height: "45px",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          </ProfileLink>

          <textarea
            className="form-control border-0"
            rows="2"
            placeholder={`What's on your mind, ${currentUser.name.split(" ")[0]}?`}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            style={{
              resize: "none",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              padding: "10px",
            }}
          ></textarea>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 position-relative">
            <img
              src={imagePreview}
              alt="preview"
              className="img-fluid rounded"
              style={{
                maxHeight: "300px",
                width: "100%",
                objectFit: "cover",
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
              onClick={handleRemoveImage}
            >
              ✕
            </button>
          </div>
        )}

        {/* Selected Feeling & Location Tags */}
        {(postFeeling || postLocation) && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {postFeeling && (
              <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                {postFeeling}
                <FaTimes
                  size={12}
                  style={{ cursor: "pointer" }}
                  onClick={() => setPostFeeling("")}
                />
              </span>
            )}
            {postLocation && (
              <span className="badge bg-danger d-flex align-items-center gap-1">
                {postLocation}
                <FaTimes
                  size={12}
                  style={{ cursor: "pointer" }}
                  onClick={() => setPostLocation("")}
                />
              </span>
            )}
          </div>
        )}

        {/* Feeling Picker Dropdown */}
        {showFeelingPicker && (
          <div
            className="mb-3 p-2 border rounded bg-light"
            style={{ maxHeight: "150px", overflowY: "auto" }}
          >
            <div className="d-flex flex-wrap gap-2">
              {FEELINGS.map((feeling) => (
                <span
                  key={feeling}
                  className="badge bg-warning text-dark"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFeelingSelect(feeling)}
                >
                  {feeling}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add options row (icons) */}
        <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3">
          <div className="d-flex align-items-center gap-3">
            <label
              htmlFor="imageUpload"
              className="text-primary d-flex align-items-center gap-1"
              style={{ cursor: "pointer" }}
            >
              <FaImage size={20} /> <span className="small">Photo</span>
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="d-none"
              onChange={handleImageUpload}
            />

            <span
              className="text-warning d-flex align-items-center gap-1"
              style={{ cursor: "pointer" }}
              onClick={() => setShowFeelingPicker(!showFeelingPicker)}
            >
              <FaSmile size={20} /> <span className="small">Feeling</span>
            </span>

            <span
              className="text-danger d-flex align-items-center gap-1"
              style={{ cursor: "pointer" }}
              onClick={handleLocationClick}
            >
              <FaMapMarkerAlt size={18} />{" "}
              <span className="small">Location</span>
            </span>
          </div>

          <button
            className="btn btn-primary px-4 rounded-pill"
            onClick={handleAddPost}
            disabled={
              loading ||
              (!postText.trim() && !postImage && !postFeeling && !postLocation)
            }
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPostSection;
