import FeedContainer from "./feedContainer.jsx";
import dummyPost from "../assets/dummyPost.jpg";
import dummyPost1 from "../assets/dummyPost1.jpg";
import dummyPost2 from "../assets/dummyPost2.jpg";
import StorieSection from "./StoriesSection";

const dummyPosts = [
  { id: 1, image: dummyPost, caption: "Hello world!" },
  { id: 2, image: dummyPost1, caption: "Nice day" },
  { id: 3, image: dummyPost2, caption: "Check this out!" },
];

function MainPageContainer() {
  return (
    <div className="container my-4 d-flex flex-column align-items-center">
      {/* View Stories Section */}
      <div className="">
        <StorieSection/>
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

      

      {/* Feed Section */}
      <div className="d-flex flex-column align-items-center w-100">
        <FeedContainer posts={dummyPosts} />
      </div>
    </div>
  );
}

export default MainPageContainer;
