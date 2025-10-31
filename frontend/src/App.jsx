import "../src/App.css";
import "./bootstrap/css/styles.css";
import Friends from "./mainPage/friends.jsx";
import MainPage from "./mainPage/mainPage.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
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
        <Route path="/friends" element = {<Friends/>}/>
      </Routes>
      {/*Chat*/}
      <Routes>
        <Route path="/chat" element = {<ChatPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
