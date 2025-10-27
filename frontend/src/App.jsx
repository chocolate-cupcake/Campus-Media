import "./bootstrap/css/styles.css";
import "./App.css";
import MainPage from "./mainPage/mainPage.jsx";
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
    </Router>
  )
}

export default App;
