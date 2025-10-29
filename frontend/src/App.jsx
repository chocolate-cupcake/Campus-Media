import "../src/App.css"
import "./bootstrap/css/styles.css";
import MainPage from "./mainPage/mainPage.jsx";
import ChatPage from "./chatPage/chatPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



function App() {
  return(


    <Router>

      <Routes> {/* for now this is our initial page since we have not made login page yet*/}
        <Route path="/" element={<MainPage />} />
      </Routes>
      {/* Route to main-page */}
      <Routes>
        <Route path="/main-page" element={<MainPage />} />
      </Routes>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App;
