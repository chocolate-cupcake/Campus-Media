import "../src/App.css"
import "./bootstrap/css/styles.css";
import MainPage from "./mainPage/mainPage.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";    
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return(

    
    <Router>
      <Routes>
        {/* Initial page */}
        <Route path="/" element={<MainPage />} />

        {/* Main page */}
        <Route path="/main-page" element={<MainPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />     
      </Routes>
    </Router>
  );
}

export default App;
