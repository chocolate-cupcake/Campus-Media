import { useState } from "react";
import { updateStudent } from "./studentData.js";
import { useNavigate } from "react-router-dom";
import ProfileLink from "../profile/ProfileLink.jsx";


// Import icons
import { FaImage, FaSmile, FaMapMarkerAlt } from "react-icons/fa";
import Buttons from "../mainPage/Buttons.jsx";

function AddPostSection({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleAddPost = () => {
    if (!postText.trim() && !postImage) return;

    const newPostId =
      Math.max(...currentUser.posts.map((p) => p.id), 0) + 1;

    const newPost = {
      id: newPostId,
      image: postImage || "",
      caption: postText,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedUser = {
      ...currentUser,
      posts: [...currentUser.posts, newPost],
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    updateStudent(currentUser.id, updatedUser);
    setCurrentUser(updatedUser);

    setPostText("");
    setPostImage(null);
    setImagePreview(null);
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
                style={{ width: "45px", height: "45px", objectFit: "cover", cursor: "pointer" }}
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

            <span className="text-warning d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
              <FaSmile size={20} /> <span className="small">Feeling</span>
            </span>

            <span className="text-danger d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
              <FaMapMarkerAlt size={18} /> <span className="small">Location</span>
            </span>
          </div>

          <button
            className="btn btn-primary px-4 rounded-pill"
            onClick={handleAddPost}
            disabled={!postText.trim() && !postImage}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPostSection;
