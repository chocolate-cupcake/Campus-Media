import { useState } from "react";
import Navbar from "./NavBar.jsx";
import MainPageContainer from "./MainPageContainer.jsx";
import SideSuggestions from "./sideSuggestions.jsx";

function MainPage() {
  const [showSuggestions, setShowSuggestions] = useState(false);

  function openSuggestions() {
    setShowSuggestions(true);
  }

  function closeSuggestions() {
    setShowSuggestions(false);
  }

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top navbar */}
      <header>
        <Navbar onOpenSuggestions={openSuggestions} />
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
