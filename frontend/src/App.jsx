import "../src/App.css";
import "./bootstrap/css/styles.css";
import Friends from "./mainPage/friends.jsx";
import MainPage from "./mainPage/mainPage.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
import ChatPage from "./chatPage/chatPage.jsx";    
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
      </Routes>
    </Router>
  );
}

export default App;
