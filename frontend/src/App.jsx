import "../src/App.css";
import "./bootstrap/css/styles.css";
import Friends from "./mainPage/friends.jsx";
import MainPage from "./mainPage/mainPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Consolidated routes in one Routes block to avoid accidental multiple matches */}
        <Route path="/" element={<MainPage />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </Router>
  );
}

export default App;
