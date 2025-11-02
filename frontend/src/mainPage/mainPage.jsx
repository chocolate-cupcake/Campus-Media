import { useState } from "react";
import NavBar from "./navBar.jsx";
import MainPageContainer from "./MainPageContainer.jsx";
import SideSuggestions from "./sideSuggestions.jsx";
import { students } from "./studentData.js";

function MainPage() {
  const [showSuggestions, setShowSuggestions] = useState(false);

  function openSuggestions() {
    setShowSuggestions(true);
  }

  function closeSuggestions() {
    setShowSuggestions(false);
  }

  const currentUser = students.find((s) => s.id === 1);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top navbar */}
      <header>
        <NavBar onOpenSuggestions={openSuggestions} currentUser={currentUser} />
      </header>

      {/* Main content with sidebar */}
      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        {/* Left Sidebar */}
        <SideSuggestions
          showOffcanvas={showSuggestions}
          closeOffcanvas={closeSuggestions}
        />
        {/* Main feed/content */}
        <main className="flex-grow-1 overflow-auto">
          <MainPageContainer />
        </main>
      </div>
    </div>
  );
}

export default MainPage;
