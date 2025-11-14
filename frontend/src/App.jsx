import "../src/App.css";
import "./bootstrap/css/styles.css";
import Friends from "./mainPage/friends.jsx";
import MainPage from "./mainPage/mainPage.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
import ChatPage from "./chatPage/chatPage.jsx";    
import StudentProfile from "./profile/StudentProfile.jsx";
import ProfessorProfile from "./profile/ProfessorProfile.jsx";
import ProfileRouter from "./profile/ProfileRouter.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./login_signUp/loginPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login routes */}
        <Route path="/" element={<LogIn />} />
        <Route path="/logIn" element={<LogIn />} />

        {/* Main pages */}
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />

         {/* Profile routes */}
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/professor-profile" element={<ProfessorProfile />} />
        <Route path="/profile/:id" element={<ProfileRouter />} />

      </Routes>
    </Router>
  );
}

export default App;
